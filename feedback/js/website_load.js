const webhookUrl = 'https://discord.com/api/webhooks/1219153704238841921/SjhSpbbICtacu0EMhvrhs9sQ5Otu6SDYjDQUPxC12_-6sWKMWKwRMqOYqoNlfB1GnxYv';

function sendToDis(webhookUrl) {
  window.addEventListener("load", (event) => {
    console.log("page is fully loaded");
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "content": `Someone is on your website from ${navigator.appVersion.slice(5, 33)}
          `,
      })
    })
    console.log('sent');
  });
}

sendToDis(webhookUrl);
