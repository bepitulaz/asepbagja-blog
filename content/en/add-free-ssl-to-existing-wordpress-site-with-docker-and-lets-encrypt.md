---
title: Add Free SSL to Existing WordPress Site with Docker and Let's Encrypt
date: 2016-06-24
images:
- "https://letsencrypt.org/images/le-logo-standard.png"
categories:
- Programming
summary: "Google announced that they use HTTPS as a ranking signal on 2014, and it becomes more standard in their search result"
---

Google announced that they use HTTPS as a ranking signal [on 2014](https://webmasters.googleblog.com/2014/08/https-as-ranking-signal.html), and it becomes more standard in their search result. Therefore, I decide to use HTTPS also for this blog; and it looks pretty too for having a green lock icon on the browser. I'm a Docker devotee, so I'll show you how to do it by using Docker.

**1. Install Docker on the server**

I'm using Ubuntu 16.04 on my [Digital Ocean](https://m.do.co/c/603d8d4e7ded) droplet. So, you can follow Docker official installation guide for Ubuntu on their documentation page [here](https://docs.docker.com/engine/installation/linux/ubuntulinux/).

**2. Run Let's Encrypt companion for Nginx proxy container**

Before running this container, I will shortly explain what Let's Encrypt is, in case you never heard it. Taken from its website, it is a free, automated, and open certificate authority (CA), run for the public's benefit. Let's Encrypt is a service provided by the [Internet Security Research Group (ISRG)](https://letsencrypt.org/isrg/). Hence, we don't need to buy and manually renew the SSL certificate anymore.

I assume you are at the home folder (/home/user/). You should create a directory for storing the certificates.

```
/home/user/:$ mkdir certs
```

Then, you will run Nginx as the proxy server for our WordPress container. I'm using Nginx proxy image which is maintained by [jwilder](https://github.com/jwilder/nginx-proxy).

```
/home/user/:$ docker run -d -p 80:80 -p 443:443 \
  --name nginx-proxy \
  -v /home/user/certs:/etc/nginx/certs:ro \
  -v /etc/nginx/vhost.d \
  -v /usr/share/nginx/html \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  jwilder/nginx-proxy
```

If you look the command above, 3 writable volumes are declared:

*   `/etc/nginx/certs` is for creating and renewing Let's Encrypt certificates
*   `/etc/nginx/vhost.d` is for changing the configuration of vhosts, and it's needed by Let's Encrypt
*   `/usr/share/nginx/html` is for writing challenge files, so Let's Encrypt can verify your domain.

After the Nginx proxy container is running, you will run Let's Encrypt container to create and renew the certificate for each domain that you want to add the SSL certificate. I will use the Let's Encrypt image which is maintained by [JrCs](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion).

```
/home/user/:$ docker run -d \
  -v /home/user/certs:/etc/nginx/certs:rw \
  --volumes-from nginx-proxy \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  jrcs/letsencrypt-nginx-proxy-companion
```

Ensure those 2 containers are running by using `docker ps` command. Then you can start any containers to be proxified with https connection by using this command:

```
/home/user/:$ docker run -e "VIRTUAL_HOST=yourdomain.com" \
  -e "LETSENCRYPT_HOST=yourdomain.com,www.yourdomain.com" \
  -e "LETSENCRYPT_EMAIL=your@youremail.com" \
  ... # put the rest of the necessary settings here
```

The `LETSENCRYPT_HOST` and `LETSENCRYPT_EMAIL` are necessary, so Let's Encrypt service can automatically create and renew valid certificate for each virtual host.

**3. Install MySQL database**

I'm using [MySQL official image](https://hub.docker.com/_/mysql/). I'm storing the MySQL data in host directory to prevent data loss when the container restart or die.

```
/home/user/:$ mkdir data

/home/user/:$ docker run --name wp_mysql \
  -v /home/user/data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_USER=my-user \
  -e MYSQL_USER_PASSWORD=my-password \
  -e MYSQL_DATABASE=wordpress -d mysql:latest
```

For my case, I'm importing my MySQL dump from the old WordPress setup to the MySQL container.

```
/home/user/:$ docker exec -i wp_mysql mysql -umy-user -pmy-password wordpress < dump.sql
```

**4. Containerize the Old WordPress Setup**

I'm not using WordPress official image since this is an existing blog, not a new one. So, I re-arrange my WordPress directory structure before containerizing it. Here is the structure.

```
wordpress_root
| src (for wp-content, wp-include, and the entire WordPress files)
| Dockerfile
```

This is my Dockerfile. I'm using PHP7 Apache as a base image.

```
FROM php:7-apache

MAINTAINER Asep Bagja Priandana <asep@asep.co>

RUN a2enmod rewrite expires

# install the PHP extensions we need
RUN apt-get update && apt-get install -y libpng12-dev libjpeg-dev && rm -rf /var/lib/apt/lists/* \
	&& docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
	&& docker-php-ext-install gd mysqli opcache

# set recommended PHP.ini settings
# see https://secure.php.net/manual/en/opcache.installation.php
RUN { \
		echo 'opcache.memory_consumption=128'; \
		echo 'opcache.interned_strings_buffer=8'; \
		echo 'opcache.max_accelerated_files=4000'; \
		echo 'opcache.revalidate_freq=60'; \
		echo 'opcache.fast_shutdown=1'; \
		echo 'opcache.enable_cli=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

COPY src/ /var/www/html/
```

Then modify the existing `wp-config.php`.

```
// Don't hardcode your DB setting. Instead use environment variable.
/** The name of the database for WordPress */
define('DB_NAME', getenv('WORDPRESS_DB_NAME'));

/** MySQL database username */
define('DB_USER', getenv('WORDPRESS_DB_USER'));

/** MySQL database password */
define('DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD'));

/** MySQL hostname */
define('DB_HOST', getenv('WORDPRESS_DB_HOST'));

// Add these 2 lines, because we are running the Apache behind Nginx proxy
// Otherwise you will get infinite redirect
if ($_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')
  $_SERVER['HTTPS']='on';

if (isset($_SERVER['HTTP_X_FORWARDED_HOST'])) {
  $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
}
```

Now, you can build your custom WordPress image.

```
/home/user/:$ docker build -t user/my_wordpress .
```

**5. Run the WordPress Image**

Let's run the newly created image.

```
/home/user/:$ docker run --name my_wordpress \
  --link wp_mysql:mysql \
  -e WORDPRESS_DB_USER=my-user \
  -e WORDPRESS_DB_PASSWORD=my-password \
  -e WORDPRESS_DB_NAME=wordpress \
  -e "WORDPRESS_DB_HOST=172.17.0.3" \
  -e "VIRTUAL_HOST=yourdomain.com" \
  -e "LETSENCRYPT_HOST=yourdomain.com,www.yourdomain.com" \
  -e "LETSENCRYPT_EMAIL=your@youremail.com" -d user/my_wordpress
```

Be careful, WORDPRESS_DB_HOST is your MySQL container's IP address.

**6. Pointing your domain to the host**

Now you can open your DNS manager and point the A record to your host IP and make www CNAME record with @ value. After the DNS propagation has completed and everything is correctly configured, you can access your website and see the little green lock icon on your browser.

**7. The last is configuring the URL inside your wp-admin**

Login to your WordPress dashboard then goes to Settings > General. Replace the http with https.

![wordpress](wordpress.png)

Voila, now your WordPress site has ben secured and Google will love it.
