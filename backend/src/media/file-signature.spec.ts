import { declaredMimeMatches, detectFileType } from "./file-signature";

const bytes = (...values: number[]) => Buffer.from(values);
const text = (value: string) => Buffer.from(value, "latin1");

describe("detectFileType", () => {
  it.each([
    ["jpeg", bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0), "image/jpeg", ".jpg"],
    ["png", bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0), "image/png", ".png"],
    ["webp", text("RIFF\x00\x00\x00\x00WEBPVP8 "), "image/webp", ".webp"],
    ["avif", text("\x00\x00\x00\x1cftypavif\x00\x00"), "image/avif", ".avif"],
    ["pdf", text("%PDF-1.7\n"), "application/pdf", ".pdf"],
    ["glb", text("glTF\x02\x00\x00\x00"), "model/gltf-binary", ".glb"],
    ["gltf", Buffer.from('﻿ {"asset":{"version":"2.0"}}'), "model/gltf+json", ".gltf"],
  ])("detects %s", (_name, buffer, mime, ext) => {
    expect(detectFileType(buffer)).toMatchObject({ mime, ext });
  });

  it.each([
    ["html", text("<!doctype html><script>alert(1)</script>")],
    ["svg", text('<svg xmlns="http://www.w3.org/2000/svg" onload="x()"/>')],
    ["exe", text("MZ\x90\x00\x03\x00")],
    ["json without asset", Buffer.from('{"foo":1}')],
    ["empty", Buffer.alloc(0)],
  ])("rejects %s", (_name, buffer) => {
    expect(detectFileType(buffer)).toBeNull();
  });

  it("rejects a missing buffer", () => {
    expect(detectFileType(undefined)).toBeNull();
  });
});

describe("declaredMimeMatches", () => {
  const png = detectFileType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))!;
  const glb = detectFileType(text("glTF\x02\x00\x00\x00"))!;

  it("requires the declared type to match the content", () => {
    expect(declaredMimeMatches("image/png", png)).toBe(true);
    expect(declaredMimeMatches("image/jpeg", png)).toBe(false);
    expect(declaredMimeMatches("text/html", png)).toBe(false);
  });

  it("accepts octet-stream only for binary glTF", () => {
    expect(declaredMimeMatches("application/octet-stream", glb)).toBe(true);
    expect(declaredMimeMatches("application/octet-stream", png)).toBe(false);
  });
});
