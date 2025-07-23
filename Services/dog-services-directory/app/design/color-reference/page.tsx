export default function ColorReference() {
  const colors = [
    { name: 'Primary', class: 'bg-primary', hex: '#11055F' },
    { name: 'Secondary', class: 'bg-secondary', hex: '#e91a7e' },
    { name: 'Third', class: 'bg-third', hex: '#185a87' },
    { name: 'Alternate 1', class: 'bg-alternate1', hex: '#add4fa' },
    { name: 'Alternate 2', class: 'bg-alternate2', hex: '#f49cc4' },
    { name: 'Alternate 3', class: 'bg-alternate3', hex: '#219982' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Brand Color Reference</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colors.map((color) => (
          <div key={color.name} className="border rounded-lg overflow-hidden shadow-sm">
            <div className={`${color.class} h-32`}></div>
            <div className="p-4">
              <h3 className="font-semibold">{color.name}</h3>
              <p className="text-sm text-gray-600">Hex: {color.hex}</p>
              <p className="text-sm text-gray-600">Class: {color.class}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Usage Examples</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-primary mb-2">Text in Primary Color</h3>
            <h3 className="text-secondary mb-2">Text in Secondary Color</h3>
            <h3 className="text-brand-navy mb-2">Text in Brand Navy</h3>
          </div>
          
          <div className="space-x-4">
            <button className="bg-primary text-white px-4 py-2 rounded">
              Primary Button
            </button>
            <button className="bg-secondary text-white px-4 py-2 rounded">
              Secondary Button
            </button>
            <button className="bg-brand-orange text-white px-4 py-2 rounded">
              Orange Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 