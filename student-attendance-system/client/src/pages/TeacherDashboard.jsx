import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  BookOpen, 
  Users, 
  QrCode, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../lib/axios';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data.classes);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลชั้นเรียน');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (classId) => {
    try {
      const response = await api.post('/teacher/attendance/open-qr', { classId });
      setQrCode(response.data.qrCode);
      setShowQRModal(true);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการสร้าง QR Code');
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'มาเรียน';
      case 'LATE':
        return 'สาย';
      case 'ABSENT':
        return 'ขาด';
      default:
        return 'ไม่ระบุ';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="ภาพรวมอาจารย์">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="ภาพรวมอาจารย์">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ชั้นเรียนทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">นักเรียนทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((total, cls) => total + cls.enrollments.length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การเข้าเรียนวันนี้</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ชั้นเรียนของฉัน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                    {cls.enrollments.length} คน
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">อาจารย์:</span> {cls.teacher.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">เวลา:</span> {JSON.parse(cls.scheduleInfo).day} {JSON.parse(cls.scheduleInfo).time}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => generateQRCode(cls.id)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    สร้าง QR
                  </button>
                  <button
                    onClick={() => setSelectedClass(cls)}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    ดูรายชื่อ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การเข้าเรียนล่าสุด</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">นักเรียน</th>
                  <th className="table-header">ชั้นเรียน</th>
                  <th className="table-header">สถานะ</th>
                  <th className="table-header">เวลา</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="table-cell">นักเรียน สมชาย เรียนดี</td>
                  <td className="table-cell">คณิตศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('PRESENT')}`}>
                      {getAttendanceStatusText('PRESENT')}
                    </span>
                  </td>
                  <td className="table-cell">08:30</td>
                </tr>
                <tr>
                  <td className="table-cell">นักเรียน สมหญิง ขยันเรียน</td>
                  <td className="table-cell">คณิตศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('LATE')}`}>
                      {getAttendanceStatusText('LATE')}
                    </span>
                  </td>
                  <td className="table-cell">08:45</td>
                </tr>
                <tr>
                  <td className="table-cell">นักเรียน สมชาย ตั้งใจเรียน</td>
                  <td className="table-cell">วิทยาศาสตร์ ม.1/1</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAttendanceStatusColor('ABSENT')}`}>
                      {getAttendanceStatusText('ABSENT')}
                    </span>
                  </td>
                  <td className="table-cell">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">คำขอลาที่รอการอนุมัติ</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">นักเรียน สมชาย เรียนดี</p>
                <p className="text-sm text-gray-600">ป่วยไข้ - 15-16 ม.ค. 2024</p>
              </div>
              <div className="flex space-x-2">
                <button className="btn-primary text-sm px-3 py-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  อนุมัติ
                </button>
                <button className="btn-danger text-sm px-3 py-1">
                  <XCircle className="h-4 w-4 mr-1" />
                  ปฏิเสธ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code สำหรับลงชื่อเข้าเรียน</h3>
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              นักเรียนสามารถสแกน QR Code นี้เพื่อลงชื่อเข้าเรียน
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowQRModal(false)}
                className="btn-secondary"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;