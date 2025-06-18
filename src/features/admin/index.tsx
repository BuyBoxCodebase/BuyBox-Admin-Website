import { Progress } from "@radix-ui/react-progress";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export default function Admin() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const baseUrl = import.meta.env.VITE_BASE_URL as string;
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
         console.log('Token:', token);
        setIsLoading(true);
        if (!token) {
            navigate({ to: '/sign-in' });
            return;
        }

        const fetchSellerDetails = async () => {
            try {
                const response = await fetch(`${baseUrl}/admin/profile/get-details`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const data = await response.json();
                
                //  getBrand();
                //  console.log('Seller details:', data);
                if (data.role === 'SUPER_ADMIN' || (data.role === 'ADMIN' && data.isVerified === true)) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem("isLoggedIn", "true");
                    navigate({ to: '/' });
                }else{
                    localStorage.setItem('isVerified','false')
                    navigate({ to: '/401' });
                }

            } catch (error) {
                console.error('Error fetching seller details:', error);
                navigate({ to: '/401' });
            }
        };

        fetchSellerDetails();
        setIsLoading(false);
    }, [token, navigate]);

    return (
        <>
            {isLoading ? <div><Progress /></div> :
                <>
                    {/* <div className="flex flex-col items-center justify-center h-screen">
                        <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
                        <p className="mt-4 text-lg">Please wait while we set up your account...</p>
                    </div> */}
                </>
            }
        </>
    );
}