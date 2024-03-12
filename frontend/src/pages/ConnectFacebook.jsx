import React from "react";
import axios from 'axios';
import FacebookLogin from 'react-facebook-login'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { linkFacebookAccountFailure, linkFacebookAccountStart, linkFacebookAccountSuccess } from "@/features/auth/facebookSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { toast } from "sonner";

export const ConnectFacebook = () => {
    const dispatch = useDispatch();
    const { isLoading, isFacebookLinked, pageDetails } = useSelector((state) => state.fb);

    const facebookAppID = import.meta.env.VITE_FACEBOOK_APP_ID;
    const facebookRedirectURI = import.meta.env.VITE_PUBLIC_ENCODED_URI;

    const responseFacebook = async (data) => {
        try {
            dispatch(linkFacebookAccountStart());
            const res = await axios.get("https://graph.facebook.com/v19.0/me/accounts", {
                params: { access_token: data?.accessToken },
            });
            const pageObj = {
                name: res?.data?.data[0]?.name,
                id: res?.data?.data[0]?.id,
                pageAccessToken: res?.data?.data[0]?.access_token,
            };
            localStorage.setItem("FB_ACCESS_TOKEN", data?.accessToken);
            localStorage.setItem("FB_PAGE_ID", pageObj.id);
            localStorage.setItem("FB_PAGE_ACCESS_TOKEN", pageObj.pageAccessToken);
            localStorage.setItem("FB_PAGE_DETAILS", JSON.stringify(pageObj));
            const payload = {
                isLoading: false,
                pageId: pageObj?.id,
                fbAccessToken: data?.accessToken,
                fbPageAccessToken: pageObj.pageAccessToken,
                pageDetails: pageObj,
                userId: data.userId
            }
            dispatch(linkFacebookAccountSuccess(payload));
            toast.success(`Connected to Facebook page ${pageObj?.name}`, {duration: 2000});
        } catch (error) {
            localStorage.removeItem("FB_ACCESS_TOKEN");
            localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
            localStorage.removeItem("FB_PAGE_ID");
            dispatch(linkFacebookAccountFailure({
                error: 'Error occured while linking facebook to Helpdesk'
            }))
            toast.success('Could not connect to the Facebook page', {duration: 2000});
        }
    };

    const deleteConnection = async () => {
        try {
            // const response = await axios.delete(`https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`, {
            //     params: {
            //         access_token:fbPageAccessToken
            //     }
            // });
            localStorage.removeItem("FB_PAGE_DETAILS");
            localStorage.removeItem("FB_ACCESS_TOKEN");
            localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
            localStorage.removeItem("FB_PAGE_ID");
            dispatch(linkFacebookAccountFailure({
                error: ''
            }))
            toast.info("Integration removed", {duration: 2000});
        } catch (error) {
            toast.error("Some Erro occurred", {duration: 2000});
        }

    };


    return (
        <div className="h-[100vh] w-[100vw] bg-primary flex justify-center items-center">
            {isLoading ? <Loader loading={isLoading} /> : null}
            <Card className="flex flex-col items-center justify-center w-[30%] h-[30vh] gap-3">
                <h1 className="font-semibold text-lg">Facebook Page Integration</h1>
                {isFacebookLinked ? (
                    <>
                        <div className="w-full flex flex-col gap-2 items-center px-10">
                            <p>Integrated Page: <span className=" font-bold">{pageDetails?.name}</span></p>
                            <Button
                                onClick={deleteConnection}
                                variant="destructive"
                                className="w-full"
                                loading={isLoading}
                            >
                                Delete Integration
                            </Button>
                            <Link className="w-full" to="/dashboard">
                                <Button className="w-full bg-blue-800">Reply To Messages</Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <FacebookLogin
                        appId={facebookAppID}
                        redirectUri={facebookRedirectURI}
                        scope="pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata,page_events,read_page_mailboxes,pages_manage_engagement"
                        callback={responseFacebook}
                        onFailure={() => {
                            toast.error("Could not connect to the Facebook page",{duration: 2000});
                        }}
                        render={(renderProps) => (
                            <Button
                                onClick={renderProps.onClick}
                                loading={isLoading}
                                className="w-full h-10"
                            >
                                Connect Page
                            </Button>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};
