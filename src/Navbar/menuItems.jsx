import { lazy } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faAddressCard, faHouseUser, faBuilding } from "@fortawesome/free-solid-svg-icons";
//
import { USER_TYPES } from "Globals.js";
//


const menuItemsSuperAdmin = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
    element:"",
  },

  {
    title: "MDM",
    to: "#",
    Icon: <FontAwesomeIcon icon={faBuilding} />,
    submenu: [
      {
        title: "WoP",
        to: "Wop",
        element: "",
      },

      {
        title: "Organizations",
        to: "Organizations",
        element: "",
      },
      {
        title: "Pass Category",
        to: "PassCategory",
        element: "",
      },
      {
        title: "Venue",
        to: "Venue",
        element: "",
      },
      {
        title: "Events",
        to: "Events",
        element: "",
      },
    ],
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "WoP Users",
        to: "WopUsers",
        element: "",
      },
      {
        title: "Organization Users",
        to: "OrganizationUsers",
        element: ""
      },
      {
        title: "Invitation Admin",
        to: "InvitationAdmin",
        element:"",
      },
      {
        title: "Nodal Officers",
        to: "NodalOfficers",
        element: "",
      },
      {
        title: "Higher Officials",
        to: "Designation",
        element:"",
      },

      {
        title: "Organizer Details",
        to: "OrganizerDetails",
        element:"",
      },

      {
        title: "Guest Users",
        to: "GuestUser",
        element:"",
      },
      {
        title: "Scanning Officers",
        to: "ScanningOfficers",
        element:"",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "Red Tip - WoP Pass",
        to: "redTipPassWop",
      
      },
      {
        title: "Red Tip - Organizers Pass",
        to: "RedTipPassOrganizer",
        
      },
      {
        title: "Assign Pass",
        to: "OfficerMaster",
      
      },
      {
        title: "Bulk Request",
        to: "BulkPass",
        element: "",
      },
      {
        title: "CPL Pass (Escort Veh)",
        to: "OfficerMaster",
       
      },

      {
        title: "My Invitations – Visitor Pass and CPL pass",
        to: "OfficerMaster",
      
      },
      {
        title: "RSVP Rcvd/Regret",
        to: "OfficerMaster",
       
      },
      {
        title: "Admin Card",
        to: "OfficerMaster",
      
      },
    ],
  },
];

const menuItemsInvitationAdmin = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
    element: "",
  },

  {
    title: "MDM",
    to: "#",
    Icon: <FontAwesomeIcon icon={faBuilding} />,
    submenu: [
      {
        title: "WoP",
        to: "Wop",
        element: "",
      },

      {
        title: "Organizations",
        to: "Organizations",
        element: "",
      },
      {
        title: "Pass Category",
        to: "PassCategory",
        element: "",
      },
      {
        title: "Venue",
        to: "Venue",
        element: "",
      },
      {
        title: "Events",
        to: "Events",
        element: "",
      },
    ],
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "WoP Users",
        to: "WopUsers",
       
      },
      {
        title: "Organization Users",
        to: "OfficerMaster",
        
      },
      {
        title: "Invitation Admin",
        to: "OfficerMaster",
       
      },
      {
        title: "Nodal Officers",
        to: "Designation",
       
      },
      {
        title: "Higher Officials",
        to: "Designation",
      
      },

      {
        title: "Organizer Details",
        to: "Designation",
       
      },

      {
        title: "Guest Users",
        to: "OfficerMaster",
       
      },
      {
        title: "Scanning Officers",
        to: "Designation",
       
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "Red Tip - WoP Pass",
        to: "MinistryMaster",
    
      },
      {
        title: "Red Tip - Organizers Pass",
        to: "OfficerMaster",
       
      },
      {
        title: "Assign Pass",
        to: "OfficerMaster",
      
      },
      {
        title: "Bulk Request",
        to: "Designation",
       
      },
      {
        title: "CPL Pass (Escort Veh)",
        to: "OfficerMaster",
      },

      {
        title: "My Invitations – Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
      {
        title: "RSVP Rcvd/Regret",
        to: "OfficerMaster",
      },
      {
        title: "Admin Card",
        to: "OfficerMaster",
      },
    ],
  },
];

const menuItemsNodalOfficer = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },
  {
    title: "MDM",
    to: "#",
    Icon: <FontAwesomeIcon icon={faBuilding} />,
    submenu: [
      {
        title: "Organizations",
        to: "Organizations",
      },
      {
        title: "Pass Category",
        to: "PassCategory",
      
      },
      {
        title: "Venue",
        to: "Venue",
      
      },
      {
        title: "Events",
        to: "Events",
       
      },
    ],
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "Organization Users",
        to: "OfficerMaster",
      },

      {
        title: "Nodal Officers",
        to: "Designation",
      },

      {
        title: "Guest Users",
        to: "OfficerMaster",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "Assign Pass",
        to: "OfficerMaster",
      },
      {
        title: "Bulk Request",
        to: "Designation",
      },

      {
        title: "My Invitations - Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
      {
        title: "RSVP Rcvd/Regret",
        to: "OfficerMaster",
      },
    ],
  },
];

const menuItemsHigherOfficials = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },
  {
    title: "MDM",
    to: "#",
    Icon: <FontAwesomeIcon icon={faBuilding} />,
    submenu: [
      {
        title: "Organizations",
        to: "Organizations",
      },
      {
        title: "Pass Category",
        to: "PassCategory",
      },
      {
        title: "Venue",
        to: "Venue",
      },
      {
        title: "Events",
        to: "Events",
      },
    ],
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "Organization Users",
        to: "OfficerMaster",
      },

      {
        title: "Nodal Officers",
        to: "Designation",
      },

      {
        title: "Guest Users",
        to: "OfficerMaster",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "Assign Pass",
        to: "OfficerMaster",
      },
      {
        title: "Bulk Request",
        to: "Designation",
      },

      {
        title: "My Invitations - Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
      {
        title: "RSVP Rcvd/Regret",
        to: "OfficerMaster",
      },
    ],
  },
];

const menuItemsPublicUser = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },
  {
    title: "Event",
    to: "Event",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "Organization Users",
        to: "OfficerMaster",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "My Invitations – Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
    ],
  },
];

const menuItemsGuestOrgUser = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },
  {
    title: "Event",
    to: "Event",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "Organization Users",
        to: "OfficerMaster",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "My Invitations – Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
    ],
  },
];

const menuItemsScanningOfficer = [
  {
    title: "Home",
    to: "Home",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },
  {
    title: "Event",
    to: "Event",
    Icon: <FontAwesomeIcon icon={faHouseUser} />,
  },

  {
    title: "User Management",
    to: "#",
    Icon: <FontAwesomeIcon icon={faUsers} />,
    submenu: [
      {
        title: "Organization Users",
        to: "OfficerMaster",
      },
    ],
  },
  {
    title: "Invitation System",
    to: "#",
    Icon: <FontAwesomeIcon icon={faAddressCard} />,
    submenu: [
      {
        title: "My Invitations – Visitor Pass and CPL pass",
        to: "OfficerMaster",
      },
    ],
  },
];

export const useMenuItem = () => {
  const user = useSelector((store) => store?.loggedInUser) || JSON?.parse(localStorage?.getItem("User"));

  switch (user?.role) {
    case USER_TYPES.ROLE_SUPERADMIN:
      return menuItemsSuperAdmin;

    case USER_TYPES.ROLE_NODALOFFICER:
      return menuItemsNodalOfficer;

    case USER_TYPES.ROLE_USHER:
      return menuItemsPublicUser;

    case USER_TYPES.ROLE_INVITEE:
      return menuItemsInvitationAdmin;
    default:
      return [];
  }
};
