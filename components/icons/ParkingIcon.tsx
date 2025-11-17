
import React from 'react';

const ParkingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.999l4.873.696a1 1 0 01.874 1.11L17.5 8.168a1 1 0 01-.97.832H3.47a1 1 0 01-.97-.832L2.257 5.805a1 1 0 01.874-1.11L8 3.999V2a1 1 0 01.7-1.046l2.6-.52a1 1 0 011 .092zM3.47 10h13.06l-1.071 4.285A1 1 0 0114.529 15H5.47a1 1 0 01-.97-.715L3.47 10z" clipRule="evenodd" />
  </svg>
);

export default ParkingIcon;
