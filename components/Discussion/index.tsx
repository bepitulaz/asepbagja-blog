interface DiscussionProps {
  language: string
}

const lang = {
  en: {
    title: "Discussion",
    description: "You can login to start discussing about this article. All discussion contents are moderated by the author.",
  },
  id: {
    title: "Diskusi",
    description: "Anda dapat login untu memulai diskusi tentang artikel ini. Semua konten diskusi dimoderasi olhe penulis."
  },
}

const Discussion = ({ language }: DiscussionProps): JSX.Element => {
  console.log(language);
  return (
    <div className="text-center">
      <h2>Discussion</h2>
      <p>You can login to start discussing about </p>
    </div>
  )
}

export default Discussion;