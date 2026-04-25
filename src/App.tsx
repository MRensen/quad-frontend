import { useState} from 'react'
import axios from "axios";
import {useForm} from "react-hook-form";
import QuestionCard from "./components/QuestionCard.tsx";
import {Slider} from "./components/ui/slider.tsx";
import {Button} from "./components/ui/button.tsx";


export interface Question {
    id: string;
    type: string;
    difficulty: string;
    category: string;
    question: string;
    answers: string[];
}

function App() {
    const [amount, setAmount] = useState<number[]>([10])
    const [questions, setQuestions] = useState<Question[]>([])
    // const BASE_URL = "http://localhost:8080/api"
    const BASE_URL = "https://trivia-backend-uuzyw.ondigitalocean.app/api"
    const {control, handleSubmit} = useForm()
    const [colors, setColors] = useState<Record<string, string>>({})

    async function getQuestions() {
        const result = await axios.get(BASE_URL+"/questions",{
            params:{"amount":amount}
        })
        setQuestions(result.data)

        // prefill de kleuren map met grijs voor elk id
        result.data.forEach((question:Question) => {
            setColors(prev => ({
                ...prev,
                [question.id]: "bg-gray-300"
            }))
        })
    }

    async function submitForm(data:[]){
        const postData:Record<string,string>[] = []

        // Zet de formdata om naar dto-vorm
        Object.entries(data).forEach(([id, answer]) => postData.push({"id":id, "answer":answer}))

        // Haal de data op
        const result = await axios.post(BASE_URL+"/checkanswers",postData,{})

        // Verander de kleuren in rood(fout) of groen(goed)
        // console.log(result.data)
        Object.entries(result.data).forEach(([id, correctness]) =>
            setColors(prev => ({
                ...prev,
                [id]: correctness ? "bg-green-300" : "bg-red-300"
            })))
    }
    return <>
        <header className="items-center mb-3">
            <h1 className="text-center text-6xl text-fuchsia-500">Trivia App</h1>
        </header>

        <main className="items-center text-center w-full">
            <section className="items-center">
                <p className="text-center text-yellow-500">
                    Selecteer hier hoeveel vragen je wil krijgen?
                </p>
                <Slider
                    value={amount}
                    onValueChange={setAmount}
                    max={30}
                    step={1}
                    className="mx-auto w-full max-w-xs my-4"
                />
                <p>Je krijgt {amount} vragen!</p>
            </section>
            <Button onClick={getQuestions}>Load questions</Button>
            {/*@ts-ignore*/}
            <form onSubmit={handleSubmit(submitForm)}>
                { questions && questions.map(question => {return <QuestionCard key={question.id} question={question} control={control} colors={colors}/>})
                }
                {questions.length > 0 &&
                    <Button type="submit">Submit</Button>
                }
            </form>
        </main>
</>
}

export default App
