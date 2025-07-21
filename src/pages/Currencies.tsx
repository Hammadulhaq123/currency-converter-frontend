import { RiAddLine } from '@remixicon/react';
import  { useState, useEffect } from 'react';
import CurrencyConverterModal from '../components/currency/ConversionModal';
import axios from '../axios'; 
import { ErrorToast } from '../components/common/Toaster';
import Pagination from '../components/common/Pagination';
import type { PaginationData } from "../components/common/Pagination"

// Type based on your IConversion interface
interface Conversion {
  _id: string;
  userId?: string;
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  exchangeRate: number;
  conversionDate: string;
  createdAt: string;
  updatedAt: string;
}

const ConversionSkeleton = () => (
  <div className="bg-white w-full rounded-3xl shadow border p-6 animate-pulse">
    <div className="mb-4">
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const NoDataComponent = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversions Yet</h3>
    <p className="text-gray-500 text-center max-w-md">
      You haven't made any currency conversions yet. Start by converting your first currency pair!
    </p>
  </div>
);

const Currencies = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConvert, setOpenConvert] = useState(false);
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const fetchConversions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/currencies/conversions?page=${currentPage}&limit=10`); 
      console.log(response)
      setConversions(response.data.conversions || []);
      setPagination(response.data.pagination || null)
    } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to fetch conversion history')
      ErrorToast(err.response?.data?.message || 'Failed to fetch conversion history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const response = await axios.get(`/currencies/conversions/stats`); 
      console.log(response)
      setStats(response.data);
      setPagination(response.data.pagination || null)
    } catch (err: any) {
      ErrorToast(err.response?.data?.message || 'Failed to fetch conversion stats');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversions();
  }, [currentPage]);

  useEffect(()=>{
    fetchStats()
  },[])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleConversionSuccess = () => {
    fetchConversions(); 
    fetchStats()
    setOpenConvert(false);
  };

  return (
    <section className="py-24 px-4 md:px-0">
        
        <div className="mx-auto max-w-7xl flex flex-col justify-start items-end">
            
          <button 
            onClick={() => setOpenConvert(true)} 
            className='h-10 w-36 flex justify-center items-center gap-1 text-md font-medium rounded-lg bg-green-primary border-none outline-none text-white hover:opacity-95 transition-colors'
          >
            <RiAddLine size={16}/>
            Convert
          </button>
        <div className='w-full flex justify-between items-center'>
          <div className='w-full flex flex-col justify-start items-start mb-8'>
            <h2 className="font-bold text-4xl text-black max-xl:text-center">
              Conversion Stats
            </h2>
            <p className="font-normal text-md text-gray-600 max-xl:text-center">
              This is your recent conversion stats.
            </p>
          </div>

        </div>

         {statsLoading ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 mb-8 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ConversionSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full justify-start mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <div
                className="relative group bg-gray-50 rounded-3xl shadow bg-white border p-4 transition-all duration-300 hover:border-green-primary"
              >
                <div className="">
                  <h6 className="font-semibold text-2xl text-black mb-1">
                    {stats?.overview?.totalConversions || 0}
                  </h6>
                  <p className="text-lg text-gray-600">
                    Total Conversions
                  </p>
                  
                </div>
                
              </div>
              <div
                className="relative group bg-gray-50 rounded-3xl shadow bg-white border p-4 transition-all duration-300 hover:border-green-primary"
              >
                <div className="">
                  <h6 className="font-semibold text-2xl text-black mb-1">
                    $ {stats?.overview?.totalAmountConverted || 0}
                  </h6>
                  <p className="text-lg text-gray-600">
                    Total Amount Converted
                  </p>
                  
                </div>
                
              </div>
              <div
                className="relative group bg-gray-50 rounded-3xl shadow bg-white border p-4 transition-all duration-300 hover:border-green-primary"
              >
                <div className="">
                  <h6 className="font-semibold text-2xl text-black mb-1">
                    {stats?.overview?.uniqueCurrencyPairsCount || 0}
                  </h6>
                  <p className="text-lg text-gray-600">
                    Unique Currency Pairs
                  </p>
                  
                </div>
                
              </div>
             
          </div>
        )}
        </div>
      <div className="mx-auto max-w-7xl">
        <div className='w-full flex justify-between items-center'>
          <div className='w-full flex flex-col justify-start items-start mb-8'>
            <h2 className="font-bold text-4xl text-black max-xl:text-center">
              Conversion History
            </h2>
            <p className="font-normal text-md text-gray-600 max-xl:text-center">
              This is your recent conversion history. It's free to convert more don't stop yourself.
            </p>
          </div>

          

          
        </div>

        <CurrencyConverterModal 
          isOpen={openConvert} 
          onClose={() => setOpenConvert(false)}
          onSuccess={handleConversionSuccess} // Add this prop to refresh data
        />

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchConversions}
                className="ml-auto text-red-600 hover:text-red-800 underline text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ConversionSkeleton key={index} />
            ))}
          </div>
        ) : conversions.length === 0 ? (
          <div className="grid grid-cols-1">
            <NoDataComponent />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {conversions.map((conversion) => (
              <div
                key={conversion._id}
                className="relative group bg-gray-50 rounded-3xl shadow bg-white border p-6 transition-all duration-300 hover:border-green-primary"
              >
                <div className="mb-4">
                  <h6 className="font-semibold text-lg text-black mb-1">
                    {conversion.originalAmount} {conversion.fromCurrency} → {conversion.toCurrency}
                  </h6>
                  <p className="text-sm text-gray-600">
                    Converted Amount: <span className="text-green-primary font-medium">
                      {conversion.convertedAmount.toLocaleString()} {conversion.toCurrency}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Rate: 1 {conversion.fromCurrency} = {conversion.exchangeRate} {conversion.toCurrency}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Date: {formatDate(conversion.conversionDate)}
                </p>
              </div>
            ))}
          </div>
        )}

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          className="mt-8"
        />

        {conversions.length > 0 && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={fetchConversions}
              className="px-6 py-2 text-sm font-medium text-green-primary border border-green-primary rounded-lg hover:bg-green-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Currencies;