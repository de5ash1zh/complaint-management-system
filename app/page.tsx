import Layout from '../components/Layout';
import ComplaintForm from '../components/ComplaintForm';

export default function Home() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Complaint Management System
          </h1>
          <p className="text-lg text-gray-600">
            Submit your complaints and track their progress
          </p>
        </div>
        
        <ComplaintForm />
      </div>
    </Layout>
  );
}
