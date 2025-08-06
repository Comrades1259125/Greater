import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../lib/axios';

const CheckInPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);

  const handleCheckIn = async () => {
    setLoading(true);
    
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, you would call the API
      // const response = await api.post('/student/attendance/check-in', { token });
      
      setCheckInStatus('success');
      toast.success('ลงชื่อเข้าเรียนสำเร็จ');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      setCheckInStatus('error');
      toast.error('เกิดข้อผิดพลาดในการลงชื่อเข้าเรียน');
    } finally {
      setLoading(false);
    }
  };

  const getStatusContent = () => {
    switch (checkInStatus) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ลงชื่อเข้าเรียนสำเร็จ</h2>
            <p className="text-gray-600 mb-4">คุณได้ลงชื่อเข้าเรียนเรียบร้อยแล้ว</p>
            <div className="text-sm text-gray-500">
              <p>กำลังกลับไปยังหน้าแรก...</p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600 mb-4">ไม่สามารถลงชื่อเข้าเรียนได้</p>
            <button
              onClick={() => setCheckInStatus(null)}
              className="btn-primary"
            >
              ลองใหม่
            </button>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <QrCode className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ลงชื่อเข้าเรียน</h2>
            <p className="text-gray-600 mb-6">คลิกปุ่มด้านล่างเพื่อลงชื่อเข้าเรียน</p>
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="btn-primary text-lg px-8 py-3"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังลงชื่อเข้าเรียน...
                </div>
              ) : (
                'ลงชื่อเข้าเรียน'
              )}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          {getStatusContent()}
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleString('th-TH')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;