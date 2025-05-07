"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Instagram, MapPin, Menu, Phone, X } from "lucide-react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Object3D } from "three";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/language-context";
import { translations } from "@/lib/translations";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

function getRandomNearbyPosition(current: { x: number; y: number }) {
  const maxStep = 2;
  let x = current.x + (Math.random() - 0.5) * maxStep;
  let y = current.y + (Math.random() - 0.5) * maxStep;
  x = Math.max(-5, Math.min(5, x));
  y = Math.max(-1, Math.min(3, y));
  return { x, y };
}

function HangGlider(props: any) {
  const ref = useRef<Object3D>(null!);
  const { scene } = useGLTF("/hangglider.glb", true);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Muda o destino a cada 6s se não estiver arrastando
  useEffect(() => {
    if (dragging) return;
    const interval = setInterval(() => {
      setTarget(getRandomNearbyPosition(position));
    }, 2000);
    return () => clearInterval(interval);
  }, [dragging, position]);

  // Anima a posição até o destino
  useFrame(({ clock }) => {
    if (ref.current && !dragging) {
      const t = clock.getElapsedTime();

      // Suavidade do movimento para o destino
      position.x += (target.x - position.x) * 0.003;
      position.y += (target.y - position.y) * 0.002;

      // Oscilação vertical (simula corrente de ar)
      const oscillation = Math.sin(t * 1.2) * 0.2 + Math.cos(t * 0.7) * 0.1;
      ref.current.position.x = position.x;
      ref.current.position.y = position.y + oscillation;

      // Simula turbulência (ruído leve)
      const turbulence = (Math.random() - 0.5) * 0.01;
      ref.current.position.x += turbulence;

      // Inclinação lateral baseada na direção do movimento
      const dx = target.x - position.x;
      ref.current.rotation.z = dx * 0.12 + Math.sin(t * 0.8) * 0.05;

      // Pitch (nariz para cima/baixo) baseado na subida/descida
      const dy = target.y - position.y;
      ref.current.rotation.x = dy * 0.01 + Math.cos(t * 0.1) * 0.1;
    }
  });

  // Drag handlers
  function onPointerDown(e: any) {
    e.stopPropagation();
    setDragging(true);
    dragOffset.current = {
      x: e.point.x - position.x,
      y: e.point.y - position.y,
    };
  }
  function onPointerMove(e: any) {
    if (dragging && ref.current) {
      position.x = e.point.x - dragOffset.current.x;
      position.y = e.point.y - dragOffset.current.y;
      ref.current.position.x = position.x;
      ref.current.position.y = position.y;
    }
  }
  function onPointerUp() {
    setDragging(false);
    setTarget(getRandomNearbyPosition(position));
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      {...props}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerLeave={onPointerUp}
      castShadow
      receiveShadow
    />
  );
}

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-md"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="#prices"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.prices}
            </Link>
            <Link
              href="#gallery"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.gallery}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.testimonials}
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.faq}
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors"
            >
              {t.nav.contact}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className=" md:flex bg-transparent text-white border-white hover:bg-white"
              onClick={() => setLanguage(language === "en" ? "pt" : "en")}
            >
              {language === "en" ? "PT" : "EN"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - New Style */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/header.jpg"
              alt="Hang Gliding in Rio de Janeiro"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Asa-delta 3D voando */}
          <Canvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "60vh",
              pointerEvents: "auto",
              zIndex: 10,
            }}
            camera={{ position: [0, 2, 10], fov: 20 }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[0, 10, 10]} intensity={0.7} />
            <HangGlider scale={0.02} rotation={[0, Math.PI, 0]} />
          </Canvas>

          {/* Backdrop na frente da imagem e da asa-delta */}
          <div className="absolute inset-0 z-20 bg-black/20  backdrop-blur" />

          {/* Conteúdo textual acima do backdrop */}
          <motion.div className="container relative z-30 w-full min-h-screen flex flex-col items-center justify-center rounded-lg text-center">
            <div className="max-w-xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 text-center"
              >
                {language === "en" ? (
                  <>
                    CONNECT WITH NATURE AND
                    <br />
                    DISCOVER THE{" "}
                    <span className="text-yellow-100">BEAUTY OF LIFE</span>
                  </>
                ) : (
                  <>
                    CONECTE-SE À NATUREZA E<br />
                    DESCUBRA AS{" "}
                    <span className="text-yellow-200">BELEZAS DA VIDA</span>
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white text-lg mb-8"
              >
                {language === "en"
                  ? "At Hang Gliding Rio, we want you to experience an incredible journey over breathtaking landscapes and discover sides of yourself you haven't explored yet."
                  : "Na Hang Gliding Rio, queremos que você viva uma experiência incrível sobre paisagens deslumbrantes e conheça lados de si mesmo que ainda não explorou."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  asChild
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg rounded-md"
                >
                  <Link
                    href="https://wa.me/5521975931852?text=Hello!%20I'd%20like%20information%20about%20hang%20gliding%20flights"
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {language === "en" ? "TALK TO US" : "FALE CONOSCO"}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="absolute bottom-10  transform -translate-x-1/2 animate-bounce z-50">
            <ChevronDown className="h-10 w-10 text-white" />
          </div>
        </section>

        {/* Dark Section Transition */}
        <div className="bg-gray-900 py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 w-8 h-8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "en"
                    ? "Safety First"
                    : "Segurança em Primeiro Lugar"}
                </h3>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Certified instructors and regularly inspected equipment for your peace of mind."
                    : "Instrutores certificados e equipamentos regularmente inspecionados para sua tranquilidade."}
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 w-8 h-8"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l3 3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "en"
                    ? "Unforgettable Experience"
                    : "Experiência Inesquecível"}
                </h3>
                <p className="text-gray-300">
                  {language === "en"
                    ? "10-15 minutes of pure adrenaline and breathtaking views of Rio de Janeiro."
                    : "10-15 minutos de pura adrenalina e vistas deslumbrantes do Rio de Janeiro."}
                </p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 w-8 h-8"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === "en"
                    ? "Memories for Life"
                    : "Memórias para a Vida"}
                </h3>
                <p className="text-gray-300">
                  {language === "en"
                    ? "Photos and videos included to capture your amazing adventure from the sky."
                    : "Fotos e vídeos incluídos para capturar sua incrível aventura pelos céus."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section id="about" className="py-20 bg-white relative overflow-hidden">
          <div className="container px-4 relative">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t.about.title}
                </h2>
                <div className="space-y-4">
                  <p className="text-lg">{t.about.paragraph1}</p>
                  <p className="text-lg">{t.about.paragraph2}</p>
                  <ul className="space-y-2">
                    {t.about.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                          <span className="text-yellow-600 text-sm">✓</span>
                        </div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/about-image.jpg"
                  alt="Hang Gliding Takeoff"
                  fill
                  className="object-cover rounded-xl hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About FlyHangGlidingRio Section */}
        <section
          id="about-fly"
          className="py-20 bg-white relative overflow-hidden"
        >
          <div className="container px-4 relative">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/about-fly-image.jpg"
                  alt="Equipe FlyHangGlidingRio"
                  fill
                  className="object-cover rounded-xl hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t.aboutFly.title}
                </h2>
                <div className="space-y-4">
                  <p className="text-lg">{t.aboutFly.paragraph1}</p>
                  <p className="text-lg">{t.aboutFly.paragraph2}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="prices" className="py-20 bg-gray-50 relative">
          <div className="container px-4 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              {t.prices.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-2 border-yellow-500 h-full overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl font-bold mb-2">
                        {t.prices.cashPrice}
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {t.prices.cashPayment}
                      </p>
                      <ul className="space-y-3 text-left w-full mb-8">
                        {t.prices.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-2"
                          >
                            <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                              <span className="text-yellow-600 text-sm">✓</span>
                            </div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all duration-300 transform hover:scale-105"
                      >
                        <Link
                          href="https://wa.me/5521975931852?text=Hello!%20I'd%20like%20to%20book%20a%20hang%20gliding%20flight%20(cash%20payment)"
                          target="_blank"
                        >
                          {t.prices.bookFlight}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-4xl font-bold mb-2">
                        {t.prices.cardPrice}
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {t.prices.cardPayment}
                      </p>
                      <ul className="space-y-3 text-left w-full mb-8">
                        {t.prices.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-2"
                          >
                            <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                              <span className="text-yellow-600 text-sm">✓</span>
                            </div>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className="w-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <Link
                          href="https://wa.me/5521975931852?text=Hello!%20I'd%20like%20to%20book%20a%20hang%20gliding%20flight%20(card%20payment)"
                          target="_blank"
                        >
                          {t.prices.bookFlight}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-white relative">
          <div className="container px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              {t.gallery.title}
            </motion.h2>
            <Tabs defaultValue="photos" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="photos">{t.gallery.photos}</TabsTrigger>
                <TabsTrigger value="videos">{t.gallery.videos}</TabsTrigger>
              </TabsList>
              <TabsContent value="photos">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
                    >
                      <Image
                        src={`/gallery-${i + 1}.jpg`}
                        alt={`Hang Gliding ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-medium">
                          {t.gallery.photoDescriptions[i % 3]}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.03 }}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="text-center p-6 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                            ▶
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {t.gallery.videoDescriptions[i]}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50 relative">
          <div className="container px-4 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              {t.testimonials.title}
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {t.testimonials.items.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-6 relative">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-yellow-500/10">
                          <Image
                            src={`/testimonial-${i + 1}.jpg`}
                            alt={testimonial.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="#FFD700"
                              stroke="#FFD700"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-pulse"
                              style={{
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: "3s",
                              }}
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <p className="mb-4 italic">"{testimonial.text}"</p>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-white">
          <div className="container px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              {t.faq.title}
            </motion.h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {t.faq.items.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <AccordionItem value={`item-${i}`} className="group">
                      <AccordionTrigger className="text-left group-hover:text-yellow-500 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900 text-white relative">
          <div className="container px-4 relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              {t.contact.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {t.contact.phone.title}
                      </h3>
                      <p className="text-gray-300">{t.contact.phone.value}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Instagram className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {t.contact.instagram.title}
                      </h3>
                      <p className="text-gray-300">
                        {t.contact.instagram.value}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {t.contact.location.title}
                      </h3>
                      <p className="text-gray-300">
                        {t.contact.location.value}
                      </p>
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mt-8"
                >
                  <h3 className="font-bold text-lg mb-4">
                    {t.contact.hours.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t.contact.hours.weekdays.day}</span>
                      <span className="font-medium">
                        {t.contact.hours.weekdays.hours}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.contact.hours.weekends.day}</span>
                      <span className="font-medium">
                        {t.contact.hours.weekends.hours}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {t.contact.hours.note}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-[300px] md:h-auto rounded-xl overflow-hidden shadow-xl"
              >
                {/* Google Maps */}
                <div className="w-full flex justify-center mt-12">
                  <iframe
                    title="Google Maps - FlyHangGlidingRio"
                    src="https://www.google.com/maps?q=Av.+Pref.+Mendes+de+Morais,+1502+-+CSCVL+-+S%C3%A3o+Conrado,+Rio+de+Janeiro+-+RJ,+22610-095&output=embed"
                    width="100%"
                    height="350"
                    style={{
                      border: 0,
                      borderRadius: "1rem",
                      maxWidth: "700px",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">
                    {t.contact.mapCaption}
                  </p>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                <Link
                  href="https://wa.me/5521975931852?text=Hello!%20I'd%20like%20information%20about%20hang%20gliding%20flights"
                  target="_blank"
                >
                  {t.contact.bookNow}
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden border-t border-gray-800">
        <div className="container px-4 relative">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <span>Hang Gliding Rio</span>
              </div>
              <p className="text-gray-400">{t.footer.description}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {t.nav.about}
                </Link>
                <Link
                  href="#prices"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {t.nav.prices}
                </Link>
                <Link
                  href="#gallery"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {t.nav.gallery}
                </Link>
                <Link
                  href="#testimonials"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {t.nav.testimonials}
                </Link>
                <Link
                  href="#faq"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {t.nav.faq}
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
              <div className="space-y-2 text-gray-400">
                <p>
                  {t.footer.whatsapp}: {t.contact.phone.value}
                </p>
                <p>
                  {t.footer.instagram}: {t.contact.instagram.value}
                </p>
                <p>
                  {t.footer.location}: {t.footer.locationValue}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Hang Gliding Rio. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-10 right-6 z-50">
        <Link
          href="https://wa.me/5521975931852?text=Hello!%20I'd%20like%20information%20about%20hang%20gliding%20flights"
          target="_blank"
          className="flex items-center justify-center h-14 w-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
