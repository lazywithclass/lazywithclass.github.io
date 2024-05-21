import { posts } from "../posts.js"
import H2 from "./H2.js"
import "./H2.css"
import "./Posts.css"


export default function Posts() {

  return (
    <div>
      <H2 text="Blog posts" />
      <ol>{ posts.map((post, i) => <Post key={i} post={post} />) }</ol>
    </div>
  )
}

function Post({ post }) {
  const { date, link, title } = post
  return (
    <li className="post"><span className="date">{date} -</span> <a href={link} className="title">{title}</a></li>
  )
}
