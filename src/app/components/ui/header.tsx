'use client'

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Download, Github, Linkedin } from "lucide-react";
import go from "@/static/go.svg";
import python from "@/static/python.svg";
import typescript from "@/static/typescript.svg";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-12 py-5 bg-zinc-900 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-white tracking-tight">Daniel A Rodrigues</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-400 font-light tracking-wide">Backend Developer</p>
          <span className="flex gap-1.5 items-center">
            <Image
              src={go}
              alt="Golang"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
            />
            <Image
              src={python}
              alt="Python"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
            />
            <Image
              src={typescript}
              alt="TypeScript"
              width={20}
              height={20}
              className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
            />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <a
            href="https://github.com/dannyboy-1412"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/daniel-rodrigues14"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        <Button
          asChild
          className="px-4 py-2 bg-zinc-800/50 text-white rounded-md hover:bg-zinc-700/50 transition-colors flex items-center gap-2"
        >
          <a href="/resume.pdf" download="daniel_resume.pdf">
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </Button>
      </div>
    </header>
  );
}
