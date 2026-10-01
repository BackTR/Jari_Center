import './DataTable.css'

export default function DataTable({ columns, data, actions = [] }) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions.length > 0 && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="data-table-actions">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        className={`data-table-btn data-table-btn--${action.type || 'primary'}`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="data-table-empty">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
