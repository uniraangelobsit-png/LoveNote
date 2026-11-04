
// =====================================
// LOVENOTE WEBSITE
// =====================================

const form = document.getElementById("letterForm");
const result = document.getElementById("result");

let currentLetter = null;
let audioURL = null;

// =====================================
// 1. FLOATING HEARTS
// =====================================

const heartContainer = document.createElement("div");
heartContainer.className = "heart-container";
heartContainer.setAttribute("aria-hidden", "true");

document.body.prepend(heartContainer);

for (let i = 0; i < 18; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = "♥";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 8 + "s";
    heart.style.animationDuration =
        (6 + Math.random() * 5) + "s";

    heart.style.fontSize =
        (14 + Math.random() * 18) + "px";

    heartContainer.appendChild(heart);
}

// =====================================
// 2. ROMANTIC MUSIC PLAYER
// =====================================

const musicPlayer = document.createElement("div");
musicPlayer.className = "music-player";

const musicTitle = document.createElement("p");
musicTitle.textContent = "🎵 Our Love Song";

const musicInput = document.createElement("input");
musicInput.type = "file";
musicInput.accept = "audio/*";
musicInput.setAttribute("aria-label", "Choose your music file");

const musicButton = document.createElement("button");
musicButton.type = "button";
musicButton.textContent = "▶ Play Music";

const audio = document.createElement("audio");
audio.loop = true;

musicPlayer.append(
    musicTitle,
    musicInput,
    musicButton
);

const main = document.querySelector("main");
const heading = main.querySelector("h2");

heading.insertAdjacentElement("afterend", musicPlayer);

musicInput.addEventListener("change", function() {
    const file = musicInput.files[0];

    if (!file) return;

    if (audioURL) {
        URL.revokeObjectURL(audioURL);
    }

    audio.pause();

    audioURL = URL.createObjectURL(file);
    audio.src = audioURL;

    musicButton.textContent = "▶ Play Music";
    musicTitle.textContent = "🎵 " + file.name;
});

musicButton.addEventListener("click", async function() {
    if (!audio.src) {
        alert("Please choose a music file first! 🎵");
        return;
    }

    if (audio.paused) {
        try {
            await audio.play();
            musicButton.textContent = "⏸ Pause Music";
        } catch {
            alert("Unable to play this audio file.");
        }
    } else {
        audio.pause();
        musicButton.textContent = "▶ Play Music";
    }
});

audio.addEventListener("ended", function() {
    musicButton.textContent = "▶ Play Music";
});

// =====================================
// 3. CREATE PERSONALIZED LOVE LETTER
// =====================================

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const recipient = document
        .getElementById("recipient")
        .value.trim();

    const sender = document
        .getElementById("sender")
        .value.trim();

    const message = document
        .getElementById("message")
        .value.trim();

    if (!recipient || !sender || !message) {
        alert("Please complete all fields ❤️");
        return;
    }

    currentLetter = {
        recipient,
        sender,
        message
    };

    result.replaceChildren();

    // Envelope section
    const envelopeSection = document.createElement("div");
    envelopeSection.className = "envelope-section";

    const instruction = document.createElement("p");
    instruction.textContent =
        "💗 You have a special letter waiting for you!";

    const envelopeButton = document.createElement("button");
    envelopeButton.type = "button";
    envelopeButton.className = "envelope-button";
    envelopeButton.setAttribute("aria-label", "Open your love letter");

    const envelope = document.createElement("div");
    envelope.className = "envelope";

    const flap = document.createElement("div");
    flap.className = "envelope-flap";

    const pocket = document.createElement("div");
    pocket.className = "envelope-pocket";

    const heart = document.createElement("span");
    heart.className = "envelope-heart";
    heart.textContent = "❤️";

    envelope.append(flap, pocket, heart);
    envelopeButton.appendChild(envelope);

    const tapText = document.createElement("p");
    tapText.textContent = "Tap the envelope to open 💌";

    envelopeSection.append(
        instruction,
        envelopeButton,
        tapText
    );

    // Letter paper
    const paper = document.createElement("div");
    paper.className = "love-paper";

    const title = document.createElement("h3");
    title.textContent = "💌 A Letter Just For You";

    const greeting = document.createElement("p");
    greeting.textContent = "Dear " + recipient + ",";

    const letterMessage = document.createElement("p");
    letterMessage.className = "letter-message";
    letterMessage.textContent = message;

    const closing = document.createElement("p");
    closing.textContent = "With all my love, ❤️";

    const signature = document.createElement("p");
    signature.className = "letter-signature";
    signature.textContent = sender;

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "letter-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "📋 Copy Letter";

    copyButton.addEventListener("click", async function() {
        const letter =
            `Dear ${recipient},\n\n${message}\n\n` +
            `With all my love,\n${sender}`;

        try {
            await navigator.clipboard.writeText(letter);
            copyButton.textContent = "✅ Copied!";
        } catch {
            alert("Copy unavailable. Please copy the letter manually.");
        }
    });

    // =====================================
    // 4. DOWNLOAD LETTER AS PDF
    // =====================================

    const downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.textContent = "📄 Download PDF";

    downloadButton.addEventListener("click", function() {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("PDF library unavailable. Please check your internet connection.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFillColor(255, 235, 242);
        pdf.rect(0, 0, 210, 297, "F");

        pdf.setTextColor(200, 65, 110);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(23);

        pdf.text("A Love Letter", 105, 35, {
            align: "center"
        });

        pdf.setDrawColor(220, 120, 150);
        pdf.line(25, 45, 185, 45);

        pdf.setTextColor(100, 55, 70);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(13);

        pdf.text(`Dear ${recipient},`, 25, 65);

        const lines = pdf.splitTextToSize(message, 155);

        let y = 82;

        lines.forEach(function(line) {
            if (y > 260) {
                pdf.addPage();
                y = 25;
            }

            pdf.text(line, 25, y);
            y += 8;
        });

        if (y > 260) {
            pdf.addPage();
            y = 25;
        }

        y += 15;

        pdf.text("With all my love,", 25, y);
        y += 10;

        pdf.setTextColor(200, 65, 110);
        pdf.setFont("helvetica", "bold");
        pdf.text(sender, 25, y);

        pdf.save(
            `LoveLetter-${recipient.replace(/[^a-z0-9]/gi, "_")}.pdf`
        );
    });

    // Create another letter
    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.textContent = "💗 Create Another";

    newButton.addEventListener("click", function() {
        form.reset();
        result.replaceChildren();

        document.getElementById("recipient").focus();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    actions.append(
        copyButton,
        downloadButton,
        newButton
    );

    paper.append(
        title,
        greeting,
        letterMessage,
        closing,
        signature,
        actions
    );

    result.append(envelopeSection, paper);

    // Open envelope animation
    envelopeButton.addEventListener("click", function() {
        if (envelope.classList.contains("open")) return;

        envelope.classList.add("open");
        envelopeButton.setAttribute("aria-expanded", "true");
        tapText.textContent = "Your letter is opening... 💕";

        setTimeout(function() {
            paper.classList.add("visible");
            tapText.textContent = "A special message from " + sender + " ❤️";

            paper.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 750);
    });

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});
