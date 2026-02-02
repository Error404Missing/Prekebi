import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Users, Calendar, Trophy, Shield, Crown } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "როგორ დავარეგისტრირო გუნდი?",
      answer:
        "პირველ რიგში უნდა შექმნათ ანგარიში. შემდეგ გადადით პროფილზე და აირჩიეთ 'გუნდის რეგისტრაცია'. შეავსეთ ყველა საჭირო ინფორმაცია თქვენი გუნდის და მოთამაშეების შესახებ.",
      icon: <Users className="w-8 h-8 text-blue-400" />,
    },
    {
      question: "რა მოხდება რეგისტრაციის შემდეგ?",
      answer:
        "რეგისტრაციის შემდეგ თქვენი გუნდი გაიგზავნება ადმინისტრაციის დასადასტურებლად. ადმინისტრატორები შეამოწმებენ ინფორმაციას და დაადასტურებენ ან უარყოფენ თქვენს განაცხადს.",
      icon: <Shield className="w-8 h-8 text-blue-400" />,
    },
    {
      question: "როგორ ვიცოდე მატჩების განრიგი?",
      answer:
        "ყველა მატჩის განრიგი გამოქვეყნებულია 'განრიგი' გვერდზე. ასევე შეგიძლიათ შემოგვიერთდეთ Discord სერვერზე, სადაც მიიღებთ ყველა განახლებას რეალურ დროში.",
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
    },
    {
      question: "რა არის VIP გუნდი?",
      answer:
        "VIP გუნდები არის განსაკუთრებული სტატუსის მქონე გუნდები, რომლებიც გამოირჩევიან თავიანთი შესრულებით და აქტივობით. VIP გუნდებს აქვთ პრიორიტეტი რეგისტრაციაში და სპეციალური აღნიშვნა საიტზე.",
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
    },
    {
      question: "რატომ შეიძლება დაიბლოკოს გუნდი?",
      answer:
        "გუნდი შეიძლება დაიბლოკოს წესების დარღვევის შემთხვევაში, მათ შორის: ჩიტინგის გამოყენება, არასწორი ინფორმაციის მიწოდება, უხეში ქცევა სხვა მოთამაშეების მიმართ, ან მატჩებზე გამოუცხადებლობა.",
      icon: <Shield className="w-8 h-8 text-red-400" />,
    },
    {
      question: "სად ვნახო შედეგები?",
      answer:
        "ყველა ტურნირის შედეგი ქვეყნდება 'შედეგები' გვერდზე. იქ ნახავთ გამარჯვებულ გუნდებს, ქულებს და ფოტო მასალას თითოეული ტურნირიდან.",
      icon: <Trophy className="w-8 h-8 text-blue-400" />,
    },
    {
      question: "როგორ გავხდე ადმინისტრატორი?",
      answer:
        "ადმინისტრატორის როლი ენიჭება მხოლოდ სანდო და გამოცდილ მომხმარებლებს. თუ გინდათ გახდეთ ადმინი, დაგვიკავშირდით Discord-ზე და წარმოადგინეთ თქვენი მოტივაცია და გამოცდილება. ადმინისტრატორები ინიშნებიან ძირითადი ადმინების მიერ მას შემდეგ, რაც გაივლიან შესაბამის ვერიფიკაციას.",
      icon: <Shield className="w-8 h-8 text-purple-400" />,
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <HelpCircle className="inline-block w-10 h-10 mr-3 text-blue-400" />
            დახმარება
          </h1>
          <p className="text-xl text-gray-400 text-pretty">ხშირად დასმული შეკითხვები</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="bg-black/50 border-blue-500/20 backdrop-blur-sm hover:border-blue-500/50 transition-all"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{faq.icon}</div>
                  <div>
                    <CardTitle className="text-xl text-blue-400 mb-2">{faq.question}</CardTitle>
                    <CardDescription className="text-gray-300 text-pretty leading-relaxed">
                      {faq.answer}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">ჯერ კიდევ გაქვთ შეკითხვები?</h2>
            <p className="text-gray-300 mb-6 text-pretty">
              თუ ვერ იპოვეთ პასუხი თქვენს შეკითხვაზე, დაგვიკავშირდით Discord-ზე ან გამოიყენეთ კონტაქტის გვერდი
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
