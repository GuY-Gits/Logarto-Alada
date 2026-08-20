let isAuthorized = false;
let myAlias = "ANONYMOUS";
const secretAnswer = "justice"; //ridle answer

const inputField = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

const socket = new WebSocket("wss://logarto-alada.onrender.com/chat");

socket.addEventListener("open", function (event) {
  printToTerminal("SYSTEM: Welcome to 'Logarto Alada'"); //displays when WebSocket connection is successful

  setTimeout(() => {
    printToTerminal("??? : Let's play a game. Just you and me.");
    setTimeout(() => {
      printToTerminal(
        "??? : It can be cruel, poetic, or blind. But when it's denied, it's violence you may find. (encryption key)",
      );
      setTimeout(() => {
        printToTerminal("--------------------------------------------------");
        printToTerminal(
          "ENCRYPTED UPLINK: 2,1,7,4,26,89,74,69,2,4,3,71,10,8,14,23,93,23,6,14,74,30,28,7,24,12,76,17,30,69,74,64,92,86,84,89,90",
        );
        printToTerminal(
          "DECRYPTION TOOL: https://cs.franklin.edu/~whittakt/ITEC136/examples/encrypter.html",
        );
        printToTerminal("--------------------------------------------------");
      }, 2000);
    }, 2000);
  }, 1000);

  setTimeout(() => {
    printToTerminal("SYSTEM: AWAITING INPUT...");
  }, 6500);
});

socket.addEventListener("message", function (event) {
  const incomingText = event.data;
  printToTerminal(incomingText);
});

function printToTerminal(text) {
  const newLine = document.createElement("div");
  newLine.style.marginBottom = "10px";
  terminalOutput.appendChild(newLine);

  const fullText = "> " + text;
  let index = 0;

  const typingInterval = setInterval(() => {
    if (index < fullText.length) {
      newLine.textContent += fullText.charAt(index);
      index++;

      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else {
      clearInterval(typingInterval);
    }
  }, 30);
}

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const userText = inputField.value;

    if (userText.trim() !== "") {
      //safety check
      if (!isAuthorized) {
        // Encodes user input to Base64 and compares it to the hidden flag
        if (btoa(userText.trim()) === "REpTSVNBQ0F7c291cmNlX2NvZGVfZm91bmRfMjAyNn0=") {
          
          printToTerminal("SYSTEM: Access Granted. Decrypting payload...");

          myAlias = prompt("ENTER SYSTEM ALIAS:") || "ANONYMOUS";
          isAuthorized = true;

          const breachMessage =
            "SYSTEM: [" + myAlias + "] has entered the channel.";
          socket.send(breachMessage);

          printToTerminal("SYSTEM: Welcome to the network, " + myAlias + ".");
        } else {
          printToTerminal("SYSTEM: Incorrect. Try again.");
        }

        inputField.value = "";
        return;
      }

      if (userText === "/clear") {
        terminalOutput.innerHTML = "";
        inputField.value = "";
        return;
      }

      if (userText === "/ping") {
        printToTerminal("SYSTEM: PONG. Local terminal is responsive.");
        inputField.value = "";
        return;
      }

      printToTerminal(myAlias + ": " + userText); //for self-terminal

      const networkPayload = myAlias + ": " + userText;
      socket.send(networkPayload);

      inputField.value = "";
    }
  }
});

document.addEventListener("click", function () {
  inputField.focus(); //even if the user clicks elsewhere, the cursor still stays at input box
});
