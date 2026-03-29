'use client'
import { useState, useEffect } from 'react' 
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const isInvalid = query.trim().length < 3;
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error("Init error：", error)
    } else {
      setResults(data || [])
    }
    setLoading(false)
  }

  const handleSearch = async () => {
  const cleanQuery = query.trim();
    if (!cleanQuery) {
      fetchInitialData()
      return
    }
  const isInvalid = query.trim().length < 2;

    setLoading(true)
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .or(`brand.ilike.%${query}%,model_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error("Search error：", error)
    } else {
      setResults(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
<nav className="p-4 bg-white shadow-sm flex justify-between items-center">
  <span className="text-xl font-semibold text-black">iGrave</span>
  
  <div className="flex items-center gap-3">
    <a 
      href="mailto:kitano39@aol.com?subject=Manual Submission(please add PDF as attachment)" 
      className="text-sm bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full hover:bg-cyan-100 transition font-medium"
    >
      📩 Submit Manuals
    </a>
    <a 
      href="https://github.com/Kitano39" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition text-gray-600"
    >
      View my Github
    </a>
  </div>
</nav>

      <main className="max-w-4xl mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-slate-800 italic">
            Retrieve the "soul" of your machine
          </h1>
          <p className="text-gray-500">You can search by brand or product name</p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl mb-12 group">
          <input 
            type="text"
            className="w-full p-5 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 text-lg outline-none shadow-inner bg-white"
            placeholder="Insert brand or model name...."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading || isInvalid}
            className="absolute right-3 top-3 bg-cyan-600 text-white px-6 py-2 rounded-xl hover:bg-cyan-700 transition font-medium disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-sm">/</span> Searching...
              </span>
            ) : 'Search'}
          </button>
        </div>

        {/* Dynamic title */}
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">
          {query ? `${results.length} search result(s):` : '✨ Recently added ✨'}
        </h2>

        {/* Result Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div 
                key={item.id || `manual-${index}`} 
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group flex flex-col justify-between"
              >
                <div>
                  {item.img_url && (
                    <div className="w-full h-48 rounded-xl mb-4 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.img_url} 
                        alt={item.model_name}
                        className="max-w-full max-h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">{item.brand}</span>
                      <h3 className="text-xl font-semibold group-hover:text-cyan-600 transition text-slate-800">
                        {item.model_name}
                        {item.is_discontinued && (
                        <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Discontinued
                        </span>
                      )}
                      </h3>
                    </div>
                  </div>
		
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Category:</span> {item.category}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="font-semibold text-gray-400">Release Year:</span> 
                      {item.release_date}

                      
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a 
                    href={item.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-600 transition-all shadow-lg shadow-slate-200 hover:shadow-gray-200"
                  >
                    View Manual
                  </a>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
              <p className="text-gray-400 text-lg font-medium">No results found.</p>
              <p className="text-gray-300 text-sm mt-1">Perhaps try another keyword or brand name?</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
