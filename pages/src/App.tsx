import type { ReactElement } from "react";
import { MagicCode } from "./components/MagicCode";
import { Code } from "./components/Code";

function App(): ReactElement {
  return (
    <div className="px-4">
      <h1>You're almost done! Just follow these next steps:</h1>
      <ol>
        <li>
          Copy this magic code: <br />
          <MagicCode />
        </li>
        <li>
          Go back to Discord where the bot is used and use the{" "}
          <Code>/code</Code> slash command pasting in your code.
        </li>
        <li>Profit.</li>
      </ol>
      <p>
        <em>
          You may at any time revoke this application's access to read your
          profile on your Osu! account settings page.
        </em>
      </p>
      <h2>Why do you have to do this?</h2>
      <p>
        If you know anything about OAuth 2.0, this saves creating a web server
        to host a callback URL. Very cheap, but does the trick.
      </p>
      <p>
        Security is important, so if you have any concerns, the code can only:
      </p>
      <ul>
        <li>Work for up to 5 minutes</li>
        <li>
          Be used solely by this application, Osu! itself will reject it from
          another app
        </li>
        <li>
          Work only with YOUR Discord account, the bot will reject stolen codes
        </li>
        <li>Be used once and once only</li>
      </ul>
    </div>
  );
}

export default App;
