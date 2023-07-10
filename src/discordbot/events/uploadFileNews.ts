import {Message} from "discord.js";
import {config, logger, minio} from "../../main";

const fetch = require("node-fetch");

export default async function uploadFileNewsEvent(message: Message) {
  const files = message.attachments;
  if (files.size === 0) return;

  const reply = await message.reply("Wird verarbeitet...");

  files.forEach((file) => {
    const url = file.url;
    const fileName = file.name.toLowerCase();

    if (!url || !fileName) return;

    const fileExtension = fileName.split(".").pop();
    if (!fileExtension) return;

    if (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "gif"
    ) {
      uploadImage(url, fileExtension).then((response) => {
        if (response) {
          message.channel.send(
            `<@${message.author.id}> hat ein Bild hochgeladen: https://${config.minio.endpoint}/${config.minio.buckets.files}/images/${response}`
          );
        }
      });
    }

    if (fileExtension === "md") {
      uploadMarkdown(url, fileName).then((response) => {
        if (response) {
          message.channel.send(
            `<@${message.author.id}> hat eine News hochgeladen: https://${config.minio.endpoint}/${config.minio.buckets.website}/news/${response}`
          );
        }
      });
    }

    reply.edit("News Beiträge werden aktualisiert...");

    fetch(`${config.news_update.endpoint}?apiKey=${config.news_update.apiKey}`).then((response: Response) => {
        if (response.ok) {
            reply.edit("News Beiträge wurden aktualisiert.");
        } else {
            reply.edit("News Beiträge konnten nicht aktualisiert werden.");
        }
    }).catch((e: Error) => {
        logger.error(e);
        reply.edit("Fehler beim Aktualisieren der News Beiträge.");
    });

    setTimeout(() => {
      reply.delete();
    }, 1000 * 10);
  });
}

async function uploadFile(
  url: string,
  fileName: string,
  type: string,
  bucket: string
) {
  return await minio.putObject(
    bucket,
    fileName,
    await (await fetch(url)).buffer(),
    {
      "Content-Type": type,
    }
  );
}

async function uploadImage(
  url: string,
  type: "png" | "jpg" | "jpeg" | "gif"
): Promise<string | null> {
  const fileName = `${Date.now()}.${type}`;

  try {
    await uploadFile(
      url,
      `images/${fileName}`,
      `image/${type}`,
      config.minio.buckets.files
    );
  } catch (e) {
    console.error(e);
    return null;
  }

  return fileName;
}

async function uploadMarkdown(
  url: string,
  name: string
): Promise<string | null> {
  try {
    await uploadFile(
      url,
      `news/${name}`,
      "text/markdown",
      config.minio.buckets.website
    );
  } catch (e) {
    console.error(e);
    return null;
  }

  return name;
}
