import { spawn } from "node:child_process";
import player from "play-sound";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

function spawnSilently(command: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, {
        stdio: "ignore",
        shell: false,
      });
      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    } catch {
      resolve(false);
    }
  });
}

export async function playNotificationSound(): Promise<void> {
  const platform = process.platform;

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const soundPath = resolvePath(__dirname, "./sounds/notification-sound.mp3");
    const p = player({});
    await new Promise<void>((resolve) => {
      // prefer afplay on macOS, mpg123/mpg321 on Linux if present; package auto-detects
      p.play(soundPath, (err: unknown) => {
        resolve();
      });
    });
    return;
  } catch {}

  if (platform === "darwin") {
    const ok = await spawnSilently("osascript", ["-e", "beep"]);
    if (ok) return;
    const okAfplay = await spawnSilently("/usr/bin/afplay", [
      "/System/Library/Sounds/Pop.aiff",
    ]);
    if (okAfplay) return;
    const okSay = await spawnSilently("/usr/bin/say", ["Done"]);
    if (okSay) return;
  } else if (platform === "win32") {
    const okPowerShell = await spawnSilently("powershell", [
      "-NoProfile",
      "-Command",
      "[console]::beep(1000,200)",
    ]);
    if (okPowerShell) return;
    const okRundll = await spawnSilently("rundll32", [
      "user32.dll,MessageBeep",
      "0xFFFFFFFF",
    ]);
    if (okRundll) return;
    const okSapi = await spawnSilently("powershell", [
      "-NoProfile",
      "-Command",
      '(New-Object -ComObject SAPI.SpVoice).Speak("Done")',
    ]);
    if (okSapi) return;
  } else {
    const okCanberra = await spawnSilently("canberra-gtk-play", ["--id=bell"]);
    if (okCanberra) return;
    const okPaplay = await spawnSilently("paplay", [
      "/usr/share/sounds/freedesktop/stereo/complete.oga",
    ]);
    if (okPaplay) return;
    const okAplay = await spawnSilently("aplay", [
      "/usr/share/sounds/alsa/Front_Center.wav",
    ]);
    if (okAplay) return;
    const okSpdSay = await spawnSilently("spd-say", ["Done"]);
    if (okSpdSay) return;
  }

  try {
    process.stdout.write("\u0007");
  } catch {}
}
