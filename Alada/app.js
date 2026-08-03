
let isAuthorized = false;
let myAlias = "ANONYMOUS"; 
const secretAnswer = "justice"; //ridle answer


const inputField = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");


const socket = new WebSocket("wss://logarto-alada.onrender.com/chat");

socket.addEventListener("open", function (event) {
  printToTerminal("SYSTEM: Welcome to 'Logarto Alada'");//displays when WebSocket connection is successful

  setTimeout(() => {
    printToTerminal("??? : Let's play a game. Just you and me.");
    setTimeout(() => {
      printToTerminal(
        "??? : It can be cruel, poetic, or blind. But when it's denied, it's violence you may find.",
      );
    }, 2000);
  }, 1000);
  setTimeout(() => {
    printToTerminal("SYSTEM: AWAITING INPUT...");
  }, 6000);
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
        if (userText.toLowerCase() === secretAnswer) {
          printToTerminal("SYSTEM: Access Granted. Decrypting payload...");

          myAlias = prompt("ENTER SYSTEM ALIAS:") || "ANONYMOUS";
          isAuthorized = true;

          const breachMessage =
            "SYSTEM: [" +
            myAlias +
            "] has entered the channel.";
          socket.send(breachMessage);

          printToTerminal("SYSTEM: Welcome to the network, " + myAlias + ".");
        } else {
          printToTerminal("SYSTEM: Incorrect. Try again.");
        }

        inputField.value = "";
        return;
      }

      //chat functionality shotcuts 
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
