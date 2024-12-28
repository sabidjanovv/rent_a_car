// import {
//   Ctx,
//   On,
//   Start,
//   Update,
//   Hears,
//   Command,
//   Action,
// } from 'nestjs-telegraf';
// import { Context, Markup } from 'telegraf';
// import { BotService } from './bot.service';
// import { UseFilters, UseGuards } from '@nestjs/common';
// // import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
// // import { AdminGuard } from '../guards/jwt-adminAuth.guard';
// // import { AdminBotGuard } from '../guards/admin.guard';

// @Update()
// export class BotUpdate {
//   constructor(private readonly botService: BotService) {}
//   @Start()
//   async oneStart(@Ctx() ctx: Context) {
//     await this.botService.start(ctx);
//   }

//   // @UseFilters(TelegrafExceptionFilter)
//   // @UseGuards(AdminBotGuard)
//   // @Command('admin')
//   // async onAdminCommand(@Ctx() ctx: Context) {
//   //   await this.botService.admin_menu(ctx, `Xush kelibsiz, ADMIN`);
//   // }

//   @On('contact')
//   async onContact(@Ctx() ctx: Context) {
//     await this.botService.onContact(ctx);
//   }

//   @Command('stop')
//   async onStop(@Ctx() ctx: Context) {
//     await this.botService.onStop(ctx);
//   }

//   @Command('address')
//   async onAddress(@Ctx() ctx: Context) {
//     await this.botService.onAddress(ctx);
//   }

//   // @Hears("Yangi manzil qo'shish")
//   // async addNewAddress(@Ctx() ctx: Context) {
//   //   await this.botService.addNewAddress(ctx);
//   // }

//   // @Hears('Mening mazillarim')
//   // async showAddresses(@Ctx() ctx: Context) {
//   //   await this.botService.showAddresses(ctx);
//   // }

//   // @On('location')
//   // async onLocation(@Ctx() ctx: Context) {
//   //   await this.botService.onLocation(ctx);
//   // }

//   // @Action(/location_+[1-9]/)
//   // async onClickLocation(@Ctx() ctx: Context) {
//   //   await this.botService.onClickLocation(ctx);
//   // }

//   @On('text')
//   async onText(@Ctx() ctx: Context) {
//     await this.botService.onText(ctx);
//   }

//   // @Command('car')
//   // async onCar(@Ctx() ctx: Context) {
//   //   await this.botService.onCar(ctx);
//   // }

//   // @Hears("Yangi avtomobil qo'shish")
//   // async addNewCar(@Ctx() ctx: Context) {
//   //   await this.botService.addNewCar(ctx);
//   // }

//   // @Hears('Mening avtomobillarim')
//   // async showCars(@Ctx() ctx: Context) {
//   //   await this.botService.showCars(ctx);
//   // }

//   // @On('text')
//   // async onTextCar(@Ctx() ctx: Context) {
//   //   await this.botService.onTextCar(ctx);
//   // }

//   // @On("photo")
//   // async onPhoto(@Ctx() ctx: Context) {
//   //   if ("photo" in ctx.message) {
//   //     console.log(ctx.message.photo);

//   //     await ctx.replyWithPhoto(
//   //       String(ctx.message.photo[ctx.message.photo.length - 1].file_id)
//   //     );
//   //   }
//   // }

//   // @On("video")
//   // async onVideo(@Ctx() ctx: Context) {
//   //   if ("video" in ctx.message) {
//   //     console.log(ctx.message.video);

//   //     await ctx.reply(String(ctx.message.video.file_name));
//   //   }
//   // }

//   // @On("sticker")
//   // async onSticker(@Ctx() ctx: Context) {
//   //   if ("sticker" in ctx.message) {
//   //     console.log(ctx.message.sticker);

//   //     await ctx.reply("😎");
//   //   }
//   // }

//   // @On("animation")
//   // async onAnimation(@Ctx() ctx: Context) {
//   //   if ("animation" in ctx.message) {
//   //     console.log(ctx.message.animation);

//   //     await ctx.reply(String(ctx.message.animation.duration));
//   //     await ctx.reply(String(ctx.message.animation.file_name));
//   //   }
//   // }

//   // @On("contact")
//   // async onContact(@Ctx() ctx: Context) {
//   //   if ("contact" in ctx.message) {
//   //     console.log(ctx.message.contact);

//   //     await ctx.reply(String(ctx.message.contact.first_name));
//   //     await ctx.reply(String(ctx.message.contact.last_name));
//   //     await ctx.reply(String(ctx.message.contact.phone_number));
//   //     await ctx.reply(String(ctx.message.contact.user_id));
//   //   }
//   // }

//   // @On("location")
//   // async onLocation(@Ctx() ctx: Context) {
//   //   if ("location" in ctx.message) {
//   //     console.log(ctx.message.location);
//   //     await ctx.reply(String(ctx.message.location.latitude));
//   //     await ctx.reply(String(ctx.message.location.longitude));
//   //     await ctx.replyWithLocation(
//   //       ctx.message.location.latitude,
//   //       ctx.message.location.longitude
//   //     );
//   //   }
//   // }

//   // @On("voice")
//   // async onVoice(@Ctx() ctx: Context) {
//   //   if ("voice" in ctx.message) {
//   //     console.log(ctx.message.voice);

//   //     await ctx.reply(String(ctx.message.voice.duration));
//   //     await ctx.replyWithVoice(String(ctx.message.voice.file_id));
//   //   }
//   // }

//   // @On("invoice")
//   // async onInvoice(@Ctx() ctx: Context) {
//   //   if ("invoice" in ctx.message) {
//   //     console.log(ctx.message.invoice);

//   //     await ctx.reply(String(ctx.message.invoice.title));
//   //   }
//   // }

//   // @On("document")
//   // async onDocument(@Ctx() ctx: Context) {
//   //   if ("document" in ctx.message) {
//   //     console.log(ctx.message.document);

//   //     await ctx.reply(String(ctx.message.document.file_name));
//   //   }
//   // }

//   // @Hears("hi")
//   // async onHi(@Ctx() ctx: Context) {
//   //   await ctx.reply("hey, there");
//   // }

//   // @Command("help")
//   // async onHelp(@Ctx() ctx: Context) {
//   //   await ctx.replyWithHTML(
//   //     `<b>start</b> - Botni ishga tushirish, \n<b>stop</b> - Botni to'xtatish \n<b>help</b> - Ushbu buyruqlarni ko'rsatish`
//   //   );
//   // }

//   // @Command("inline")
//   // async inlineButtons(@Ctx() ctx: Context) {
//   //   const inlineKeyboard = [
//   //     [
//   //       {
//   //         text: "Button 1",
//   //         callback_data: "button_1",
//   //       },
//   //       {
//   //         text: "Button 2",
//   //         callback_data: "button_2",
//   //       },
//   //       {
//   //         text: "Button 3",
//   //         callback_data: "button_3",
//   //       },
//   //     ],
//   //     [
//   //       {
//   //         text: "Button 4",
//   //         callback_data: "button_4",
//   //       },
//   //       {
//   //         text: "Button 5",
//   //         callback_data: "button_5",
//   //       },
//   //     ],
//   //     [
//   //       {
//   //         text: "Button 6",
//   //         callback_data: "button_6",
//   //       },
//   //     ],
//   //   ];

//   //   await ctx.reply("Kerakli inline buttonni tanla: ", {
//   //     reply_markup: {
//   //       inline_keyboard: inlineKeyboard,
//   //     },
//   //   });
//   // }

//   // @Action("button1")
//   // async onClickButton1(@Ctx() ctx: Context) {
//   //   await ctx.reply("Button 1 tugmasi bosildi");
//   // }

//   // @Action("button2")
//   // async onClickButton2(@Ctx() ctx: Context) {
//   //   await ctx.reply("Button 2 tugmasi bosildi");
//   // }

//   // @Action(/button_+[1-9]/)
//   // async onClickAnyButton(@Ctx() ctx: Context) {
//   //   const actText:String = ctx.callbackQuery["data"];
//   //   const button_id = Number(actText.split("_")[1]);
//   //   await ctx.reply(`Ixtiyoriy Button ${button_id} tugmasi bosildi`);
//   // }

//   // @Command("main")
//   // async mainButtons(@Ctx() ctx: Context){
//   //   await ctx.reply("Kerakli Buttonni tanla:", {
//   //     parse_mode: "HTML",
//   //     ...Markup.keyboard([
//   //       ["bir", "ikki", "uch"],
//   //       ["to'rt", "besh"],
//   //       ["olti"],
//   //       [Markup.button.contactRequest("📱 Telefon raqamni yuboring")],
//   //       [Markup.button.locationRequest("📍 Manzilni yuboring")],
//   //     ]).resize().oneTime()
//   //   })
//   // }

//   // @Hears("bir")
//   // async onBirButtonClick(@Ctx() ctx: Context){
//   //   await ctx.reply("Bir tugmasi bosildi");
//   // }

//   // @On("text")
//   // async onText(@Ctx() ctx: Context) {
//   //   console.log(ctx);

//   //   if ("text" in ctx.message) {
//   //     if (ctx.message.text == "salom") {
//   //       await ctx.replyWithHTML("<b> Hello! </b>");
//   //     } else {
//   //       await ctx.replyWithHTML(ctx.message.text);
//   //     }
//   //   }
//   // }

//   // @On("message") // hardoim oxirida turish kerak, chunki text photo va boshqalarni usholmasa shunga tushadi
//   // async onMessage(@Ctx() ctx: Context) {
//   //   console.log(ctx.botInfo);
//   //   console.log(ctx.chat);
//   //   console.log(ctx.chat.id);
//   //   console.log(ctx.from);
//   //   console.log(ctx.from.first_name);
//   // }
// }
