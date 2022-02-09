// bot/scenes.js
//
const { Scenes } = require("telegraf");
const { customPath } = require("../services");
const { model } = require("../model");
const { updateUsersDb, readUsersDb, checkUsersDb } = model;
const fs = require("fs");

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
    ctx.session = checkUsersDb(ctx.session, ctx.from.id);
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
      ctx.session[ctx.from.id].wallets.push({
        name: ctx.wizard.state.data.name,
        address: ctx.wizard.state.data.address
      });
    } else {
      ctx.session[ctx.from.id] = initializeSession({
        name: ctx.wizard.state.data.name,
        address: ctx.wizard.state.data.address
      });
    }

    updateUsersDb(ctx.from.id, ctx.session[ctx.from.id]);
    return ctx.scene.leave();
  }
);

const checkWizard = new Scenes.WizardScene("CHECK_WIZARD", ctx => {
  ctx.session = checkUsersDb(ctx.session, ctx.from.id);
  if (
    ctx.session[ctx.from.id].hasInitialized &&
    ctx.session[ctx.from.id].wallets.length > 0
  ) {
    let reply = "Wallets being tracked:\n\n";
    ctx.session[ctx.from.id].wallets.forEach(wallet => {
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
    ctx.session = checkUsersDb(ctx.session, ctx.from.id);
    if (
      ctx.session[ctx.from.id].hasInitialized &&
      ctx.session[ctx.from.id].wallets.length > 0
    ) {
      let reply = "This are the wallets you have added:\n\n";
      ctx.session[ctx.from.id].wallets.forEach(wallet => {
        reply += `Wallet Name: ${wallet.name}\nWallet address: ${wallet.address}\n\n`;
      });
      reply +=
        "Please enter the wallet address or name of the wallet you want to delete";
      ctx.reply(reply);
    } else {
      ctx.reply("You havent added any wallet to track");
      return ctx.scene.leave();
    }
    return ctx.wizard.next();
  },
  ctx => {
    if (walletExistsInDB(ctx.message.text, ctx.session[ctx.from.id].wallets)) {
      // if the wallet exists in the ctx.session.wallets
      let newDB = removeWalletFromDB(
        ctx.message.text,
        ctx.session[ctx.from.id].wallets
      );
      ctx.session[ctx.from.id].wallets = newDB;
      ctx.reply("Wallet successfully removed from list of tracked wallets");
    } else {
      ctx.reply(
        "The wallet info you entered doesnt match with any wallet being tracked right now"
      );
    }
    updateUsersDb(ctx.from.id, ctx.session[ctx.from.id]);
    return ctx.scene.leave();
  }
);

exports.startWizard = startWizard;
exports.checkWizard = checkWizard;
exports.deleteWizard = deleteWizard;
exports.isValidICONWallet = isValidICONWallet;
