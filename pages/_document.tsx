import Document, { Html, Head, Main, NextScript } from "next/document";

const kofi = `<script>
kofiWidgetOverlay.draw('asepbagja', {
  'type': 'floating-chat',
  'floating-chat.donateButton.text': 'Tip Me',
  'floating-chat.donateButton.background-color': '#d9534f',
  'floating-chat.donateButton.text-color': '#fff'
})
</script>`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" />
          <div dangerouslySetInnerHTML={{ __html: kofi }} />
        </body>
      </Html>
    );
  }
}
