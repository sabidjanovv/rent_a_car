// import { Injectable } from '@nestjs/common';
// import { CreateBotDto } from './dto/create-bot.dto';
// import { UpdateBotDto } from './dto/update-bot.dto';
// import { InjectModel } from '@nestjs/sequelize';
// import { Bot } from './models/bot.model';
// import { InjectBot } from 'nestjs-telegraf';
// import { BOT_NAME } from '../app.constants';
// import { Context, Telegraf, Markup } from 'telegraf';

// @Injectable()
// export class BotService {
//   constructor(
//     @InjectModel(Bot) private botModel: typeof Bot,
//     @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
//   ) {}
//   async start(ctx: Context) {
//     const userId = ctx.from.id;
//     const user = await this.botModel.findByPk(userId);
//     if (!user) {
//       await this.botModel.create({
//         user_id: userId,
//         username: ctx.from.username,
//         first_name: ctx.from.first_name,
//         last_name: ctx.from.last_name,
//         lang: ctx.from.language_code,
//       });
//       await ctx.reply(
//         `Iltimos, <b>"📱 Telefon raqamni yuboring" tugmasini bosing</b>`,
//         {
//           parse_mode: 'HTML',
//           ...Markup.keyboard([
//             [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
//           ])
//             .resize()
//             .oneTime(),
//         },
//       );
//     } else if (!user.status) {
//       await ctx.reply(
//         `Iltimos, <b>"📱 Telefon raqamni yuboring" tugmasini bosing</b>`,
//         {
//           parse_mode: 'HTML',
//           ...Markup.keyboard([
//             [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
//           ])
//             .resize()
//             .oneTime(),
//         },
//       );
//     } else {
//       await ctx.reply(
//         `Bu bot Stadion egalarini faollashtirish uchun ishlatilinadi`,
//         {
//           parse_mode: 'HTML',
//           ...Markup.removeKeyboard(),
//         },
//       );
//     }
//   }

//   async onContact(ctx: Context) {
//     if ('contact' in ctx.message) {
//       const userId = ctx.from.id;
//       const user = await this.botModel.findByPk(userId);
//       if (!user) {
//         await ctx.reply(`Iltimos, Start tugmasini bosing`, {
//           parse_mode: 'HTML',
//           ...Markup.keyboard([['/start']])
//             .resize()
//             .oneTime(),
//         });
//       } else if (ctx.message.contact.user_id != userId) {
//         await ctx.reply(`Iltimos, O'zingizni telefon raqamingizni yuboring!`, {
//           parse_mode: 'HTML',
//           ...Markup.keyboard([
//             [Markup.button.contactRequest('📱 Telefon raqamni yuboring')],
//           ])
//             .resize()
//             .oneTime(),
//         });
//       } else {
//         await this.botModel.update(
//           {
//             phone_number: ctx.message.contact.phone_number,
//             status: true,
//           },
//           {
//             where: { user_id: userId },
//           },
//         );
//         await ctx.reply(`Tabriklayman siz faollashtirildingiz`, {
//           parse_mode: 'HTML',
//           ...Markup.removeKeyboard(),
//         });
//       }
//     }
//   }

//   async onStop(ctx: Context) {
//     const userId = ctx.from.id;
//     const user = await this.botModel.findByPk(userId);
//     if (!user) {
//       await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
//         parse_mode: 'HTML',
//         ...Markup.keyboard([['/start']])
//           .resize()
//           .oneTime(),
//       });
//     } else if (user.status) {
//       await this.botModel.update(
//         { status: false, phone_number: null },
//         { where: { user_id: userId } },
//       );
//       await this.bot.telegram.sendChatAction(user.user_id, 'typing');
//       await ctx.reply(`Siz botdan chiqdingiz`, {
//         parse_mode: 'HTML',
//         ...Markup.removeKeyboard(),
//       });
//     }
//   }

//   async onAddress(ctx: Context) {
//     await ctx.reply(`Manzillarim`, {
//       parse_mode: 'HTML',
//       ...Markup.keyboard([
//         ['Mening mazillarim', "Yangi manzil qo'shish"],
//       ]).resize(),
//     });
//   }

//   async onText(ctx: Context) {
//     if ('text' in ctx.message) {
//       const userId = ctx.from.id;
//       const user = await this.botModel.findByPk(userId);
//       if (!user) {
//         await ctx.reply(`Siz avval ro'yxattan o'tmagansiz`, {
//           parse_mode: 'HTML',
//           ...Markup.keyboard([['/start']])
//             .resize()
//             .oneTime(),
//         });
//       }}}

  
//   async sendOtp(phone_number: string, OTP: string): Promise<boolean> {
//     const user = await this.botModel.findOne({ where: { phone_number } });

//     if (!user || !user.status) {
//       return false;
//     }

//     await this.bot.telegram.sendChatAction(user.user_id, 'typing');

//     await this.bot.telegram.sendMessage(
//       user.user_id,
//       'Verify OTP code: ' + OTP,
//     );
//     return true;
//   }

//   async admin_menu(ctx: Context, menu_text = `<b>Admin menyusi</b>`) {
//     try {
//       await ctx.reply(menu_text, {
//         parse_mode: 'HTML',
//         ...Markup.keyboard([['Mijozlar', 'Ustalar']])
//           .oneTime()
//           .resize(),
//       });
//     } catch (error) {
//       console.log('Admin menyusida xatolik', error);
//     }
//   }
// }
