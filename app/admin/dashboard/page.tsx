import React from "react";
import styles from "./Dashboard.module.css"
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import NewMessages from "@/components/Widgets/NewMessages/NewMessages";
import ActiveUsers from "@/components/Widgets/ActiveUsers/ActiveUsers";
import SitesClicks from "@/components/Widgets/SitesClicks/SitesClicks";
import TotalCount from "@/components/Widgets/TotalCount/TotalCount";
import LatestMedia from "@/components/Widgets/LatestMedia/LatestMedia";
import UpcomingMeetings from "@/components/Widgets/UpcomingMeetings/UpcomingMeetings";
import NewComments from "@/components/Widgets/NewComments/NewComments";
import PendingUsers from "@/components/Widgets/PendingUsers/PendingUsers";

const Dashboard: React.FC = () => {
    const breadcrumbs: breadcrumb[] = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard'
        },
        {
            label: 'Home',
            href: '/admin/dashboard'
        }
    ];

    return (
        <div className={styles.container}>
            <Breadcrumbs breadcrumbs={breadcrumbs}/>
            <div className={styles.dashboard}>
                <NewMessages />
                <ActiveUsers />
                <SitesClicks />
                <TotalCount  title="Total Posts" count={35} />
                <LatestMedia />
                <UpcomingMeetings />
                <NewComments />
                <TotalCount  title="Newsletter Subs" count={147} />
                <PendingUsers />
            </div>
        </div>
    );
}

export default Dashboard;