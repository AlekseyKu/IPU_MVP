export default function TestPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-green-500 mb-4">Tailwind работает ✅</h1>
      <div className="flex gap-4">
        <button className="bg-gray-300 px-4 py-2 rounded">Кнопка</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Зелёная</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Красная</button>
      </div>
    </main>
  )
}
