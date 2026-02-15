import "./Header.css"
import Logo from "./Logo.js"
import so from "./stackoverflow.png"
import gh from "./github.png"

export default function Header() {
  return (
    <header>
      <Logo />
      <div className="online-presence">
        <div>
          <a href="https://stackoverflow.com/users/57095/alberto-zaccagni"><img src={so} /><span>スタックオーバーフロー</span></a>
        </div>
        <div>
          <a href="https://github.com/lazywithclass"><img src={gh} /><span>ギットハブ</span></a>
        </div>
      </div>
    </header>
  )
}
