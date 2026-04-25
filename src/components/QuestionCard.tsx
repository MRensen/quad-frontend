import type {Question} from "../App.tsx";
import {Field, FieldLabel} from "./ui/field.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "./ui/select.tsx";
import he from "he"
import {type Control, Controller} from "react-hook-form";

export function QuestionCard({question, colors, control}:{question:Question, colors: Record<string, string> , control:Control<any>}) {
    // ${color=="green" ? "bg-green-300": color == "red"? "bg-red-300": "bg-gray-300"}
    return (
        <div className={`max-w-md 
        mx-auto 
        ${colors[question.id] ?? "bg-gray-300 border-red-500 border-1"}
        rounded-sm 
        border-2 
        text-center 
        my-10`}>
            <Field key={question.id}>
                <FieldLabel>Question: {he.decode(question.question)}</FieldLabel>
                <Controller
                    name={question.id}
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue placeholder="Select an answer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{question.type}</SelectLabel>
                                    {question.answers.map((answer)=>{
                                        return (
                                            <SelectItem key={answer} value={answer}>{he.decode(answer)}</SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </Field>
        </div>
    )
}

export default QuestionCard;