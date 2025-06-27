// frontend/src/app/test/page.tsx
export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Tailwind работает <span className="text-green-600 text-2xl">✅</span>
      </h1>

      <div className="flex gap-3 mb-6">
        <button className="bg-gray-300 text-white px-4 py-2 rounded">Кнопка</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Зелёная</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Красная</button>
      </div>

      <p className="text-sm text-gray-700 text-center max-w-xs">
        Если ты видишь цвета, градиенты и шрифты — Tailwind подключен правильно
      </p>
    </div>
  )
}
