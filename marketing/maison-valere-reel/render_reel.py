"""Render the Maison Valère Instagram portfolio reel from approved site captures."""

from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
W, H, FPS = 720, 1280, 24
SCENE_SECONDS = 3.5
SCENE_FRAMES = round(SCENE_SECONDS * FPS)
SCENES = 6
DURATION = SCENE_FRAMES * SCENES / FPS

INK = (18, 19, 16)
CREAM = (239, 237, 230)
OLIVE = (69, 77, 57)
ACCENT = (201, 79, 39)
MUTED = (156, 158, 149)

FONT_DIR = Path('/System/Library/Fonts/Supplemental')
DISPLAY = FONT_DIR / 'DIN Condensed Bold.ttf'
SANS = FONT_DIR / 'Arial Narrow Bold.ttf'
BODY = FONT_DIR / 'Arial.ttf'


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


F12 = font(BODY, 12)
F15 = font(BODY, 15)
F19 = font(BODY, 19)
F22 = font(BODY, 22)
F26 = font(SANS, 26)
F36 = font(DISPLAY, 36)
F72 = font(DISPLAY, 72)
F84 = font(DISPLAY, 84)
F104 = font(DISPLAY, 104)
F126 = font(DISPLAY, 126)


def ease(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def alpha_in(t: float, start: float = 0.12, duration: float = 0.5) -> int:
    return round(255 * ease((t - start) / duration))


def text_layer(base: Image.Image, xy: tuple[int, int], label: str,
               face: ImageFont.FreeTypeFont, fill: tuple[int, int, int],
               opacity: int = 255, spacing: int = 0) -> None:
    layer = Image.new('RGBA', base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if spacing:
        x, y = xy
        for ch in label:
            d.text((x, y), ch, font=face, fill=(*fill, opacity))
            x += d.textlength(ch, font=face) + spacing
    else:
        d.text(xy, label, font=face, fill=(*fill, opacity))
    base.alpha_composite(layer)


def line(base: Image.Image, xy: tuple[int, int, int, int],
         fill: tuple[int, int, int], width: int = 1) -> None:
    ImageDraw.Draw(base).line(xy, fill=(*fill, 255), width=width)


def rectangle(base: Image.Image, xy: tuple[int, int, int, int],
              fill: tuple[int, int, int], radius: int = 0) -> None:
    d = ImageDraw.Draw(base)
    if radius:
        d.rounded_rectangle(xy, radius=radius, fill=(*fill, 255))
    else:
        d.rectangle(xy, fill=(*fill, 255))


def frame_base(bg: tuple[int, int, int], number: str,
               light: bool = False) -> Image.Image:
    im = Image.new('RGBA', (W, H), (*bg, 255))
    fg = INK if light else CREAM
    text_layer(im, (42, 38), 'MAISON VALÈRE', F26, fg, spacing=1)
    text_layer(im, (42, 75), 'A DIGITAL FASHION EXPERIENCE', F12,
               MUTED if not light else OLIVE, spacing=2)
    line(im, (42, 112, 678, 112), fg)
    text_layer(im, (42, 1222), 'PROJECT SHOWCASE  /  2026', F12,
               MUTED if not light else OLIVE, spacing=1)
    text_layer(im, (632, 1222), number, F15, ACCENT)
    return im


def reveal_label(im: Image.Image, label: str, x: int, y: int,
                 local: float, light: bool = False) -> None:
    color = OLIVE if light else CREAM
    opacity = alpha_in(local, 0.18, 0.4)
    text_layer(im, (x, y + round((1 - opacity / 255) * 16)),
               label, F15, color, opacity, spacing=2)
    rectangle(im, (x, y - 10, x + round(38 * opacity / 255), y - 7), ACCENT)


def screenshot(name: str, crop_bottom: int = 0) -> Image.Image:
    im = Image.open(ROOT / name).convert('RGB')
    if crop_bottom:
        im = im.crop((0, 0, im.width, im.height - crop_bottom))
    return im


ASSETS = {
    'hero': Image.open(OUT / 'hero.jpg').convert('RGB'),
    'desktop': screenshot('home-desktop-2.png', 45),
    'mobile_home': screenshot('mobile-home-2.png', 65),
    'mobile_shop': screenshot('mobile-shop.png', 65),
    'shop': screenshot('shop-desktop-2.png', 45),
    'pdp': screenshot('pdp-desktop.png', 45),
    'cart': screenshot('cart-drawer.png', 45),
}

_gradient = np.zeros((H, W, 4), dtype=np.uint8)
_gradient[..., 3] = (40 + 160*(np.arange(H)[:, None]/H)**1.8).astype(np.uint8)
DARK_GRADIENT = Image.fromarray(_gradient, 'RGBA')


def paste_card(im: Image.Image, source: Image.Image, x: int, y: int,
               width: int, height: int, local: float, delay: float = 0,
               mobile: bool = False) -> None:
    p = ease((local - delay) / 0.55)
    if p <= 0:
        return
    y += round((1 - p) * 95)
    shadow = Image.new('RGBA', (width + 24, height + 24), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((12, 12, width + 12, height + 12), radius=22 if mobile else 9,
                         fill=(0, 0, 0, 75))
    im.alpha_composite(shadow, (x - 12, y - 6))
    border = 12 if mobile else 3
    chrome = 0 if mobile else 27
    rectangle(im, (x, y, x + width, y + height), INK, radius=20 if mobile else 5)
    if not mobile:
        rectangle(im, (x + border, y + border, x + width - border, y + 27), (246, 245, 240))
        for i, c in enumerate(((211, 111, 91), (225, 188, 112), (127, 160, 119))):
            ImageDraw.Draw(im).ellipse((x + 15 + i*15, y + 12, x + 22 + i*15, y + 19),
                                      fill=(*c, 255))
    inner = (width - 2*border, height - chrome - border)
    fit = ImageOps.contain(source, inner, Image.Resampling.LANCZOS)
    im.paste(fit, (x + border + (inner[0]-fit.width)//2,
                   y + chrome + (inner[1]-fit.height)//2))
    if mobile:
        rectangle(im, (x + width//2 - 30, y + 5, x + width//2 + 30, y + 10), INK, radius=3)


def scene_intro(t: float) -> Image.Image:
    hero = ASSETS['hero']
    zoom = 1.02 + 0.045*t/SCENE_SECONDS
    sw, sh = round(W*zoom), round(H*zoom)
    bg = ImageOps.fit(hero, (sw, sh), Image.Resampling.LANCZOS)
    bg = bg.crop(((sw-W)//2, (sh-H)//2, (sw+W)//2, (sh+H)//2)).convert('RGBA')
    bg.alpha_composite(DARK_GRADIENT)
    text_layer(bg, (42, 45), 'PROJECT  /  01', F15, CREAM, alpha_in(t, 0, 0.4), spacing=2)
    text_layer(bg, (42, 111), 'MAISON VALÈRE', F26, CREAM, alpha_in(t, 0.12, 0.45), spacing=1)
    line(bg, (42, 153, 678, 153), CREAM)
    opacity = alpha_in(t, 0.35, 0.6)
    rise = round((1 - opacity/255)*36)
    text_layer(bg, (36, 854 + rise), 'FASHION', F126, CREAM, opacity)
    text_layer(bg, (36, 960 + rise), 'IN MOTION', F126, CREAM, opacity)
    rectangle(bg, (42, 1115, 42 + round(120*ease(t/0.8)), 1121), ACCENT)
    text_layer(bg, (42, 1153), 'A COMMERCE EXPERIENCE BY DESIGN', F15, CREAM,
               alpha_in(t, 0.9, 0.5), spacing=1)
    return bg


def scene_desktop(t: float) -> Image.Image:
    im = frame_base(CREAM, '01 / 05', True)
    reveal_label(im, 'THE FIRST IMPRESSION', 42, 161, t, True)
    p = alpha_in(t, 0.2, 0.5)
    text_layer(im, (36, 215 + round((1-p/255)*22)), 'A STORE WITH', F104, INK, p)
    text_layer(im, (36, 303 + round((1-p/255)*22)), 'PRESENCE.', F104, INK, p)
    paste_card(im, ASSETS['desktop'], 38, 484, 644, 385, t, 0.38)
    line(im, (42, 938, 678, 938), OLIVE)
    text_layer(im, (42, 967), 'CAMPAIGN-LED HOMEPAGE', F36, INK, alpha_in(t, 0.75, 0.45))
    text_layer(im, (42, 1021), 'Bold identity. Editorial rhythm. Clear direction.', F19,
               OLIVE, alpha_in(t, 0.95, 0.45))
    return im


def scene_mobile(t: float) -> Image.Image:
    im = frame_base(OLIVE, '02 / 05')
    reveal_label(im, 'RESPONSIVE BY DESIGN', 42, 160, t)
    p = alpha_in(t, 0.18, 0.55)
    text_layer(im, (36, 207), 'EVERY SCREEN.', F104, CREAM, p)
    text_layer(im, (36, 292), 'EVERY DETAIL.', F104, CREAM, p)
    paste_card(im, ASSETS['mobile_home'], 43, 470, 296, 590, t, 0.30, True)
    paste_card(im, ASSETS['mobile_shop'], 381, 523, 296, 590, t, 0.55, True)
    text_layer(im, (42, 1159), 'Mobile shopping, with room to breathe.', F19, CREAM,
               alpha_in(t, 0.8, 0.4))
    return im


def scene_catalog(t: float) -> Image.Image:
    im = frame_base(CREAM, '03 / 05', True)
    reveal_label(im, 'PRODUCT DISCOVERY', 42, 163, t, True)
    p = alpha_in(t, 0.18, 0.55)
    text_layer(im, (36, 211), '37 PIECES.', F126, INK, p)
    text_layer(im, (36, 309), 'ONE IDENTITY.', F104, INK, p)
    paste_card(im, ASSETS['shop'], 38, 491, 644, 407, t, 0.4)
    rectangle(im, (42, 960, 678, 1065), INK)
    text_layer(im, (65, 982), 'FILTER. FIND. FALL IN LOVE.', F36, CREAM,
               alpha_in(t, 0.8, 0.4))
    text_layer(im, (65, 1032), 'Search, size, colour and category.', F15, MUTED,
               alpha_in(t, 1, 0.4))
    return im


def scene_journey(t: float) -> Image.Image:
    im = frame_base(INK, '04 / 05')
    reveal_label(im, 'THE SHOPPING JOURNEY', 42, 161, t)
    p = alpha_in(t, 0.2, 0.5)
    text_layer(im, (36, 207), 'DETAIL TO', F104, CREAM, p)
    text_layer(im, (36, 292), 'CHECKOUT.', F104, CREAM, p)
    paste_card(im, ASSETS['pdp'], 38, 465, 644, 375, t, 0.3)
    paste_card(im, ASSETS['cart'], 110, 780, 572, 329, t, 0.8)
    text_layer(im, (42, 1161), 'A seamless path from desire to decision.', F19,
               CREAM, alpha_in(t, 1.0, 0.45))
    return im


def scene_outro(t: float) -> Image.Image:
    im = Image.new('RGBA', (W, H), (*INK, 255))
    rectangle(im, (0, 0, 20, H), ACCENT)
    line(im, (42, 170, 678, 170), OLIVE)
    text_layer(im, (42, 128), 'DIGITAL PROJECT / 2026', F15, MUTED, spacing=2)
    p = alpha_in(t, 0.15, 0.7)
    text_layer(im, (37, 355 + round((1-p/255)*35)), 'MAISON', F126, CREAM, p)
    text_layer(im, (37, 460 + round((1-p/255)*35)), 'VALÈRE.', F126, CREAM, p)
    rectangle(im, (42, 637, 42 + round(160*ease(t/0.85)), 643), ACCENT)
    text_layer(im, (42, 698), 'DESIGN THAT', F72, CREAM, alpha_in(t, 0.7, 0.5))
    text_layer(im, (42, 764), 'MOVES PEOPLE.', F72, CREAM, alpha_in(t, 0.8, 0.5))
    text_layer(im, (42, 903), 'A COMPLETE FASHION COMMERCE EXPERIENCE', F15,
               MUTED, alpha_in(t, 1.15, 0.5), spacing=1)
    line(im, (42, 1058, 678, 1058), OLIVE)
    text_layer(im, (42, 1103), 'maison-valere.netlify.app', F22, CREAM,
               alpha_in(t, 1.25, 0.5))
    text_layer(im, (42, 1222), 'YOUR BRAND COULD BE NEXT.', F15, ACCENT,
               alpha_in(t, 1.6, 0.5), spacing=1)
    return im


SCENE_FUNCS = [scene_intro, scene_desktop, scene_mobile,
               scene_catalog, scene_journey, scene_outro]


def render_frame(i: int) -> Image.Image:
    scene = min(SCENES-1, i // SCENE_FRAMES)
    local = (i % SCENE_FRAMES) / FPS
    im = SCENE_FUNCS[scene](local)
    transition = 0.22
    if scene < SCENES-1 and local > SCENE_SECONDS-transition:
        p = ease((local - (SCENE_SECONDS-transition))/transition)
        nxt = SCENE_FUNCS[scene+1](0.12 + p*0.2)
        im = Image.blend(im, nxt, p)
    return im.convert('RGB')


def create_audio(path: Path) -> None:
    """Original minimal electronic bed, generated locally without licensed audio."""
    sr = 44100
    n = round(DURATION*sr)
    audio = np.zeros(n, dtype=np.float64)
    rng = np.random.default_rng(2026)
    beat = 60/104
    # Warm A-minor pad, softened by slow amplitude movement.
    tm = np.arange(n)/sr
    pad = sum(np.sin(2*np.pi*f*tm + 0.3*np.sin(2*np.pi*0.12*tm))
              for f in (110.0, 130.81, 164.81, 220.0)) / 4
    pad *= 0.055*(0.7+0.3*np.sin(2*np.pi*0.18*tm))
    audio += pad
    # Kick / clap / hat pattern, restrained enough for voiceover to be added later.
    for step in range(int(DURATION/beat)+2):
        start = round(step*beat*sr)
        if start >= n: break
        length = min(round(0.34*sr), n-start)
        tt = np.arange(length)/sr
        kick = np.sin(2*np.pi*(52*tt + 50*(1-np.exp(-tt*28))/28)) * np.exp(-tt*16)
        audio[start:start+length] += 0.18*kick
        if step % 2 == 1:
            clap_len = min(round(.13*sr), n-start)
            noise = rng.normal(0, 1, clap_len)
            audio[start:start+clap_len] += 0.042*noise*np.exp(-np.arange(clap_len)/sr*30)
    for step in range(int(DURATION/(beat/2))+2):
        start = round(step*(beat/2)*sr)
        if start >= n: break
        length = min(round(.045*sr), n-start)
        noise = rng.normal(0, 1, length)
        audio[start:start+length] += 0.013*noise*np.exp(-np.arange(length)/sr*90)
    fade = np.minimum(1, tm/0.45)*np.minimum(1, (DURATION-tm)/1.1)
    audio *= np.clip(fade, 0, 1)
    audio = np.clip(audio, -0.9, 0.9)
    with wave.open(str(path), 'wb') as out:
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(sr)
        out.writeframes((audio*32767).astype('<i2').tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cover = render_frame(45)
    cover.resize((1080, 1920), Image.Resampling.LANCZOS).save(OUT/'cover.png')
    audio_path = OUT/'original-audio.wav'
    create_audio(audio_path)
    output = OUT/'maison-valere-instagram-reel.mp4'
    command = [
        'ffmpeg', '-y', '-loglevel', 'error',
        '-f', 'rawvideo', '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24',
        '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
        '-i', str(audio_path),
        '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
        '-c:a', 'aac', '-b:a', '160k', '-shortest',
        '-movflags', '+faststart', str(output),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    for i in range(SCENE_FRAMES*SCENES):
        process.stdin.write(render_frame(i).tobytes())
        if i % 84 == 0:
            print(f'{i}/{SCENE_FRAMES*SCENES} frames', flush=True)
    process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError('ffmpeg failed')
    print(output)


if __name__ == '__main__':
    main()
