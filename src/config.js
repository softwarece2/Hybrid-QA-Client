const host = document.getElementById("host-api")?.innerText;
const host_ws = document.getElementById("ws-api")?.innerText;
const vms_ip = document.getElementById("vms_ip")?.innerText;
const cv2_ip = document.getElementById("cv2_ip")?.innerText;
const pdf_api_host = document.getElementById("host-pdf-api")?.innerText;
export const MASTER_URL = host + "olms-master-services/";
export const TRANSACTION_URL = host + "olms-tran-services/";
export const OLMS_RPT_SERVICES = host + "olms-rpt-services/";
export const OLMS_OFD_SERVICES = host + "olms-ofd-services/";
export const OLMS_ATE_SERVICES = host + "olms-ate-services/";
export const encryptionSecret = "my&ecretKey12345";
export const PDF_SERVER = pdf_api_host;
export const OLMS_IOL_SERVICES = host + "olms-iol-services/";
//Machilipattnam Translab api url
export const VIRTUALQA_API_MCP = "http://192.168.10.103";
export const CV2_IP = cv2_ip;

// redirecting to Machilipattnam  application url
export const MCH_IP_ADDR = "http://192.168.10.104:8080/VirtualQA";
export const MCH_IP_CAM_ADDR = "http://192.168.10.107";
export const SOLARS_CAM =
  "https://teams.microsoft.com/l/meetup-join/19%3ameeting_NmYyMWFiMmQtYmM1Yy00MTQ1LWIzYjctZDExYmY1ZDczZTcw%40thread.v2/0?context=%7b%22Tid%22%3a%22ffb58250-e613-447b-96ee-d19db7b31259%22%2c%22Oid%22%3a%224d130804-18e1-4f0d-84c1-221ec75319f9%22%7d";
export const SOCKET_URL = host_ws;
export const PEER_URL = "http://35.200.143.26";
export const PEER_PORT = 9000;
export const VMS_IP = vms_ip;
export const TRANSACTION_CHAT_URL =
  "http://localhost:8088/";
