import { useState, useEffect } from 'react'
import { fetchJSON, getBackendBase } from './utils/api'

function Test() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendUrl, setBackendUrl] = useState('')
  const [databaseStatus, setDatabaseStatus] = useState(null)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const base = await getBackendBase()
      setBackendUrl(base)

      const data = await fetchJSON('/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      setBackendStatus(`✅ Connected - ${data.message || 'OK'}`)

      await checkDatabaseConnection()
    } catch (error) {
      setBackendStatus(`❌ Error - ${error.message}`)
      setDatabaseStatus({ error: 'Backend not accessible' })
    }
  }

  const checkDatabaseConnection = async () => {
    try {
      const dbData = await fetchJSON('/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      setDatabaseStatus(dbData)
    } catch (error) {
      setDatabaseStatus({ error: `Database check failed - ${error.message}` })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Backend & Database Test
        </h1>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Backend URL:</h3>
            <p className="text-sm text-gray-600 break-all bg-gray-100 p-2 rounded">
              {backendUrl || 'Detecting...'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Backend Status:</h3>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {backendStatus}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Database Status:</h3>
            <div className="text-sm bg-gray-100 p-3 rounded">
              {databaseStatus ? (
                databaseStatus.error ? (
                  <p className="text-red-600 font-mono">{databaseStatus.error}</p>
                ) : (
                  <div className="space-y-2">
                    <p><span className="font-semibold">Backend:</span> {databaseStatus.backend}</p>
                    <p><span className="font-semibold">Database:</span> {databaseStatus.database}</p>
                    <p><span className="font-semibold">DB URL:</span> {databaseStatus.database_url}</p>
                    <p><span className="font-semibold">DB Name:</span> {databaseStatus.database_name}</p>
                    <p><span className="font-semibold">Connection:</span> {databaseStatus.connection_status}</p>
                    {databaseStatus.collections && databaseStatus.collections.length > 0 && (
                      <p><span className="font-semibold">Collections:</span> {databaseStatus.collections.join(', ')}</p>
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500 font-mono">Checking database...</p>
              )}
            </div>
          </div>

          <button
            onClick={checkBackendConnection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Test Again
          </button>

          <a
            href="/"
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded text-center transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default Test
