# Eqdeha mobile screens

Each file is one 390x844 phone screen (HTML with inline styles, RTL Arabic).
Text inside {{...}} and <sc-for>/<sc-if> is dynamic; the script at the bottom of each file (renderVals) shows the sample data and the interactive states.
Links between screens: <a href="X.dc.html"> means "navigate to screen X" (files here are renamed with a number prefix).

App start: Splash (2s) -> RolePick (customer or courier) -> Login, or sign up (customer: Main..., courier: CPhone...).

## shared

| File | Screen |
|---|---|
| shared/00a-Splash.html | ٠. شاشة الترحيب (ثانيتين) |
| shared/00b-RolePick.html | ٠. اختيار عميل أو مندوب |
| shared/00c-Login.html | ٠. تسجيل الدخول |

## customer

| File | Screen |
|---|---|
| customer/01-Main.html | ١. رقم الموبايل |
| customer/02-Terms.html | ٢. الشروط والأحكام |
| customer/03-Otp.html | ٣. كود واتساب |
| customer/04-Profile.html | ٤. بياناتك |
| customer/05-Home.html | ٥. الرئيسية |
| customer/06-Shops.html | ٦. المحلات |
| customer/07-ShopOrder.html | ٧. اطلب من المحلات |
| customer/08-AnyOrder.html | ٨. اطلب أي حاجة |
| customer/09-MapPick.html | ٩. اختيار المكان من الخريطة |
| customer/10-Points.html | ١٠. نقاطي |
| customer/11-Offers.html | ١١. عروض المناديب |
| customer/12-Tracking.html | ١٢. متابعة الأوردر |
| customer/13-Chat.html | ١٣. الشات مع المندوب |
| customer/14-Invoice.html | ١٤. فاتورة المحل |
| customer/15-FinalInvoice.html | ١٥. الفاتورة النهائية والدفع |
| customer/16-Delivered.html | ١٦. التسليم والتقييم |
| customer/17-Notifications.html | ١٧. الإشعارات |
| customer/18-Account.html | ١٨. حسابي |
| customer/19-CourierReviews.html | ١٩. تقييمات المندوب |
| customer/20-Orders.html | ٢٠. طلباتي |

## courier

| File | Screen |
|---|---|
| courier/21-CPhone.html | ٢١. المندوب – رقم الموبايل |
| courier/22-COtp.html | ٢٢. المندوب – كود واتساب |
| courier/23-CInfo.html | ٢٣. المندوب – بياناته |
| courier/24-CVehicle.html | ٢٤. المندوب – البطاقة والعربية |
| courier/25-CPending.html | ٢٥. المندوب – مستني الموافقة |
| courier/26-CHome.html | ٢٦. المندوب – الأوردرات |
| courier/27-CChat.html | ٢٧. المندوب – شات الأوردر |
| courier/28-CInvoice.html | ٢٨. المندوب – عمل فاتورة |
| courier/29-CDeliver.html | ٢٩. المندوب – التسليم والتحصيل |
| courier/30-CWallet.html | ٣٠. المندوب – المحفظة والسداد |
| courier/31-CProfile.html | ٣١. المندوب – حسابه |
| courier/32-CPoints.html | ٣٢. المندوب – نقاطي |

