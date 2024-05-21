import H2 from "./H2.js"
import "./H2.css"

import Ombra from "./projects/ombra"

export default function Projects() {
  return (
	  <div className="projects">
    	<H2 text="My projects" />

    	<Ombra />

	  </div>
  )
}
