import "./App.css"
import Header from "./components/Header.js"
import Posts from "./components/Posts.js"
import Projects from "./components/Projects.js"

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="wrapper">
        <Posts />
        <Projects />
      </div>
    </div>
  );
}
