// bot/scenes.js
//
const { Scenes } = require("telegraf");

//Functions
function isValidICONWallet(wallet) {
  let regex = new RegExp("^hx([a-fA-F0-9]{40,40}$)");

  return regex.test(wallet);
}

function initializeSession(wallet) {
  let session = {
    hasInitialized: true,
    wallets: [wallet]
  };

  return session;
}

function walletExistsInDB(walletInfo, db) {
  let result = false;

  db.forEach(walletInDb => {
    if (walletInfo === walletInDb.name || walletInfo === walletInDb.address) {
      result = true;
    }
  });
  return result;
}
function removeWalletFromDB(walletInfo, db) {
  let newDb = [];
  db.forEach(walletInDb => {
    if (walletInfo === walletInDb.name || walletInfo === walletInDb.address) {
      // do nothing
    } else {
      newDb.push(walletInDb);
    }
  });
  return newDb;
}

//scenes
const startWizard = new Scenes.WizardScene(
  "START_WIZARD",
  ctx => {
    ctx.reply(
      "Please send the public address of the wallet you want to track:"
    );
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  ctx => {
    if (!isValidICONWallet(ctx.message.text)) {
      ctx.reply("Please enter a valid ICON wallet");
      return;
    }
    ctx.wizard.state.data.address = ctx.message.text;
    ctx.reply("Please enter a name to identify the wallet:");
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.message.text.length > 25) {
      ctx.reply("Choose a smaller name, max 25 characters");
      return;
    }

    ctx.wizard.state.data.name = ctx.message.text;
    ctx.reply(
      `You have successfully added a wallet to track.\n\nWallet name: ${ctx.wizard.state.data.name}\nWallet address: ${ctx.wizard.state.data.address}`
    );

    if (ctx.session.hasInitialized) {
      ctx.session.wallets.push({
        name: ctx.wizard.state.data.name,
        address: ctx.wizard.state.data.address
      });
    } else {
      ctx.session = initializeSession({
        name: ctx.wizard.state.data.name,
        address: ctx.wizard.state.data.address
      });
    }
    return ctx.scene.leave();
  }
);

const checkWizard = new Scenes.WizardScene("CHECK_WIZARD", ctx => {
  if (ctx.session.hasInitialized) {
    let reply = "Wallets being tracked:\n\n";
    ctx.session.wallets.forEach(wallet => {
      reply += `Wallet name: ${wallet.name}\nWallet Address: ${wallet.address}\n\n`;
    });
    ctx.reply(reply);
  } else {
    ctx.reply("You havent added any wallet to monitor");
  }
  return ctx.scene.leave();
});

const deleteWizard = new Scenes.WizardScene(
  "DELETE_WIZARD",
  ctx => {
    if (ctx.session.hasInitialized) {
      let reply = "This are the wallets you have added:\n\n";
      ctx.session.wallets.forEach(wallet => {
        reply += `Wallet Name: ${wallet.name}\nWallet address: ${wallet.address}\n\n`;
      });
    } else {
      ctx.reply("You havent added any wallet to track");
      return ctx.scene.leave();
    }
    ctx.reply(
      "Please enter the wallet address or name of the wallet you want to delete"
    );
    return ctx.wizard.next();
  },
  ctx => {
    if (walletExistsInDB(ctx.message.text, ctx.session.wallets)) {
      // if the wallet exists in the ctx.session.wallets
      let newDB = removeWalletFromDB(ctx.message.text, ctx.session.wallets);
      ctx.session.wallets = newDB;
      ctx.reply("Wallet successfully removed from list of tracked wallets");
    } else {
      ctx.reply(
        "The wallet info you entered doesnt match with any wallet being tracked right now"
      );
    }
    return ctx.scene.leave();
  }
);

exports.startWizard = startWizard;
exports.checkWizard = checkWizard;
exports.deleteWizard = deleteWizard;
exports.isValidICONWallet = isValidICONWallet;
