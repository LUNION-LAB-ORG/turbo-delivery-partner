import { Button, Calendar, DatePicker, Modal, ModalBody, ModalContent, Spinner } from "@heroui/react";
import { Controller } from "react-hook-form";
import { useReportingController } from "./controller";
import { SelectField } from "../commons/form/select-field";
import { Select, SelectItem } from "@heroui/select";

interface Props {
    isOpen?: boolean;
    onClose: () => void;
    restaurantId?: string;
    type?: string;
    initialiType?: string;
}
export function TicketTermineReportingDialog({ isOpen, onClose, restaurantId, type, initialiType }: Props) {
    const ctrl = useReportingController(restaurantId, type, initialiType)
    return (
        <Modal isOpen={isOpen} size={"md"} onClose={onClose} >
            <ModalContent>
                <ModalBody className="p-5">
                    {ctrl.isLoading && <div className="absolute top-[40%] z-40 left-[45%]">
                        <Spinner color="danger" size="lg" /></div>}
                    <div className="text-center text-primary">Imprimez les bons de livraison</div>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <Controller name="debut" control={ctrl.form.control}
                            render={({ field }) =>
                                <DatePicker className="w-full" label="Date de debut" onChange={(value: any) => {
                                    if (value?.year && value?.month && value?.day) {
                                        const nativeDate = new Date(value.year, value?.month - 1, value.day);
                                        field.onChange(nativeDate?.toISOString().slice(0, 10))
                                    } else {
                                        field.onChange(value?.toString());
                                    }
                                }} />}
                        />
                        <Controller name="fin" control={ctrl.form.control}
                            render={({ field }) =>
                                <DatePicker className="w-full" label="Date de fin" onChange={(value: any) => {
                                    if (value?.year && value?.month && value?.day) {
                                        const nativeDate = new Date(value.year, value?.month - 1, value.day);
                                        field.onChange(nativeDate?.toISOString().slice(0, 10))
                                    } else {
                                        field.onChange(value?.toString());
                                    }
                                }} />}
                        />
                        {
                            type &&
                            <div>
                                <div className="mb-2 text-sm ml-2">Selectionnez un type</div>
                                <Select className="max-w-lg" aria-label="Type sélectionné" defaultSelectedKeys={[type]}
                                    isDisabled  >
                                    <SelectItem key={type}>
                                        {type}
                                    </SelectItem>
                                </Select>
                            </div>
                        }
                        <Controller name="format" control={ctrl.form.control}
                            render={({ field }) =>
                                <div className="w-full ">
                                    <div className="mb-2 ml-2 text-sm">Selectionnez un format</div>
                                    <SelectField label=""
                                        options={[
                                            { label: "PDF", key: "PDF" },
                                            { label: "EXCEL", key: "EXCEL" }
                                        ]} setSelectValue={field.onChange} selectValue={field.value} />
                                </div>
                            } />
                    </div>
                    <div className="flex justify-end mt-8">
                        <div className="flex gap-2">
                            <Button onPress={ctrl.onPreview} className="h-10  text-md">Previsuliser</Button>
                            <Button onPress={ctrl.onexportFile} className="h-10 bg-primary text-white font-bold text-md">Exporter</Button>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}