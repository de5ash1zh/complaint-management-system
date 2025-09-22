import Layout from '../../components/Layout';
import AdminTable from '../../components/AdminTable';
import AdminHeader from '../../components/AdminHeader';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongoose';
import Complaint from '@/models/Complaint';

async function getComplaints() {
  try {
    await dbConnect();
    const complaints = await Complaint.find({}).sort({ dateSubmitted: -1 }).lean();
    return JSON.parse(JSON.stringify(complaints));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const role = (session.user as any)?.role || 'user';
  if (role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </Layout>
    );
  }
  const complaints = await getComplaints();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage and track all customer complaints
            </p>
          </div>
          <AdminHeader />
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{complaints.length}</div>
              <div className="text-sm text-gray-500">Total Complaints</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-600">
                {complaints.filter((c: any) => c.status === 'Pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600">
                {complaints.filter((c: any) => c.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">
                {complaints.filter((c: any) => c.status === 'Resolved').length}
              </div>
              <div className="text-sm text-gray-500">Resolved</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-center">
              <div className="text-xl font-semibold text-red-600">
                {complaints.filter((c: any) => c.priority === 'High').length}
              </div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
          </div>
        </div>

        {/* Admin Table */}
        <AdminTable initialComplaints={complaints} />
      </div>
    </Layout>
  );
}
