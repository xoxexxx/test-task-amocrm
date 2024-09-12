import { useAppStore, useLocalStore } from "../store"
import { ILead } from "../app";
export const Item = ({ onClick, data }: { onClick: React.MouseEventHandler<HTMLDivElement>, data: ILead }) => {

    const { open_lead, setOpenLead } = useAppStore(state => state);
    const { local_lead_task, setLocalLeadTask } = useLocalStore(state => state);

    function parseDate(d: any) {
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    function viewTask(task: {text: string; complete_till: number}) {
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const oneDayInSeconds = 24 * 3600;
        const tomorrowTimestamp = currentTimestamp + oneDayInSeconds;
        const dayAfterTomorrowTimestamp = currentTimestamp + 2 * oneDayInSeconds;

        let circle_color: any = "";

        if (task.complete_till < currentTimestamp) {
            circle_color = 'red';
        } else if (task.complete_till >= currentTimestamp && task.complete_till < tomorrowTimestamp) {
            circle_color = 'green';
        } else if (task.complete_till >= tomorrowTimestamp && task.complete_till < dayAfterTomorrowTimestamp) {
            circle_color = 'yellow';
        } else {
            circle_color = 'red';
        }


        return <><div>task:</div>
            <div className="flex flex-col gap-0.5 px-2">{data.tasks && data.tasks.map((task: any, idx: number) => <div className="flex items-center gap-2">
                <div>{task.text}</div>
                <div>
                    <svg
                        className={`w-4 h-4 rounded-full  ${circle_color === "red" ? "bg-red-600" : circle_color === "yellow" ? "bg-yellow-600" : "bg-green-600"}`}></svg>
                </div>
            </div>)}
            </div>
        </>

    }

    return <div className="transition-opacity ease-in duration-700 opacity-100">
        {!open_lead.some((el: any) => el === data.id) ?
            <div onClick={onClick} className="flex flex-col justify-between h-full">
                <div>
                    <div>id: {data.id}</div>
                    <div>{data.name}</div>
                </div>
                <div className="w-full mt-5 text-end">{data.price}₽</div>
            </div>
            :
            <div onClick={onClick}>
                <div>
                    <div>id: {data.id}</div>
                    <div>date: {parseDate(new Date(data.created_at))}</div>
                    <div className="flex gap-3  justify-between">
                        {data.tasks && viewTask(data?.tasks[0])}
                    </div>
                    <div className="w-full mt-5 text-end">{data.price}₽</div>
                </div>
            </div>
        }

    </div>
}
