import Link from 'next/link'
import { FaList, FaExclamationTriangle } from 'react-icons/fa'

const AdminNav = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/admin/services"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          pathname === '/admin/services' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
        }`}
      >
        <FaList className="w-5 h-5" />
        <span>Services</span>
      </Link>
      <Link
        href="/admin/error-logs"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          pathname === '/admin/error-logs' ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
        }`}
      >
        <FaExclamationTriangle className="w-5 h-5" />
        <span>Error Logs</span>
      </Link>
    </div>
  )
}

export default AdminNav 