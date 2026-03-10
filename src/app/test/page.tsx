export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <div className="p-20 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">xVisual Laboratórium</h1>
      <p className="mb-8 text-gray-700">Tu budeme testovať prežitie bodiek.</p>
      
      {/* TOTO TLAČIDLO BUDEME ZA CHVÍĽU MUČIŤ A UPRAVOVAŤ */}
      <div className="mt-10 p-5 border-2 border-red-500">
          <button id="magicke-tlacidlo" className="...">Odoslať objednávku 1</button>
      </div>
    </div>
  );
}