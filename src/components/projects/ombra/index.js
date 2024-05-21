import { verify } from "./ombra"
import Typewriter from 'typewriter-effect'
import "./ombra.css"

function fromFable(fsharpList) {
  if (!fsharpList.tail) {
    return []
  }


  return [fsharpList.head].concat(fromFable(fsharpList.tail))
}

export default function Ombra() {
  let fsharpList = verify()
  let steps = fromFable(fsharpList)

  return (
    <div className="ombra">

      <h3><a href="https://github.com/jessi-bit/Ombra">Ombra</a></h3>
      <p>Ombra verifies using FsCheck that a closure based interpreter and a substitution based interpreter yield the same results</p>

      <div>
        <div className="terminal-header">Ombra console</div>
        <div className="code">
          <Typewriter options={{delay: 30}} onInit={t =>
            t.typeString("Checking for credentials ")
            // .changeCursor(" ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)

              .typeString("<br />Infinity Improbability Engine is generating AST for Ombra-equivalence ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)
              .pasteString(`<pre class="nowrap">${steps[0]}</pre>`)

              .typeString("Converting into human readable format ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)
              .pasteString(`<pre>${steps[4]}</pre>`)

              .typeString("Checking Ombra-equivalence<br />")
              .typeString("Generating closure based interpreter answer ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)
              .pasteString(`<pre class="nowrap">${steps[2]}</pre>`)
              .typeString("Generating substitution based interpreter answer ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)
              .pasteString(`<pre class="nowrap">${steps[1]}</pre>`)

              .typeString("Comparing ")
              .pauseFor(2000)
              .pasteString(`<span class="ok">[OK]</span>`)
              .typeString("<br />Are they the same?")
              .pasteString(`<pre>${steps[3]}</pre>`)

              .start()
          } />
        </div>

      </div>

    </div>
  )
}

