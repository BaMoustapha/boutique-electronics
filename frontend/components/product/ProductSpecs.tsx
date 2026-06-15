interface ProductSpecsProps {
  specifications: Record<string, string>
}

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  const entries = Object.entries(specifications)

  if (entries.length === 0) return null

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2.5 font-medium text-gray-700 w-2/5 align-top">{key}</td>
              <td className="px-4 py-2.5 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
