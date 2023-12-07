import React, {useEffect, useState, useContext} from 'react';
import {useFormik} from 'formik';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {classNames} from 'primereact/utils';
import UserContext from "@/context/user/User.context";
import {useRouter} from "next/router";
import {unique} from "@/utils/formats";
import Loading from "@/components/commons/Loading/Loading";
import {modeSpeech} from "@/utils/const";
import StudentsContext from "@/context/students/Students.context";
import {InputTextarea} from "primereact/inputtextarea";
import GetTel from "@/components/curso/tel/GetTel";
import PlanningContext from "@/context/planning/Planning.context";


const LandingTEL = () => {
    const [selectAmbit, setSelectAmbit] = useState(null);

    const router = useRouter();
    const {grade} = router.query;
    const level = grade.split('-')[1].slice(0, -1)
    const {
        getSpeechBases,
        speechBases,
        speechBasesLoading,
        speechBasesError,
        user,
    } = useContext(UserContext);

    const {
        getRegisters,
        setRegister,
        registersLoading,
        lectionariesError,
    } = useContext(PlanningContext);

    const {
        students,
    } = useContext(StudentsContext);

    const filterStudents = students.filter(student => student.grade === grade.toUpperCase())

    const ambit = unique(speechBases.map(base => {
        return base.ambito
    }));

    const content = unique(speechBases.filter(base => {
        return base.ambito === selectAmbit
    }).map(base => base.contenido));

    useEffect(() => {
        if (speechBases.length === 0) {
            getSpeechBases(level.toUpperCase())
        }
    }, [grade])

    const formik = useFormik({
        initialValues: {
            mode: '',
            ambit: '',
            content: '',
            studentsSpeech: [],
        },
        validate: (data) => {
            let errors = {};

            if (!data.mode || data.mode === '') {
                errors.mode = 'La modalidad es obligatoria';
            }

            if (!data.ambit || data.ambit === '') {
                errors.ambit = 'El nivel fonoaudiológico es obligatorio';
            }

            if (!data.content || data.content === '') {
                errors.content = 'El contenido es obligatorio';
            }

            if (!data.studentsSpeech || data.studentsSpeech.length === 0) {
                errors.studentsSpeech = 'Los estudiantes son obligatorios';
            }
            return errors;
        },
        onSubmit: (data) => {
            if (Object.values(formik.errors).length === 0) {
                const id = new Date()
                const newData = {
                    id: 'reg-fono-' + grade + "-" + id.getTime(),
                    alumnos: data.studentsSpeech.map(student => {
                        return {alumnoSeleccionado: student.name}
                    }),
                    curso: grade.toUpperCase(),
                    contenidos: data.content.map(c => {
                        return {
                            "contenido": {
                                "ambito": data.ambit,
                                "contenido": c,
                            },
                        }
                    }),
                    modalidad: data.mode,
                    publishedAt: id,
                    observaciones: data.register,
                    usuario: user
                }
                setRegister(newData)
                getRegisters(grade.toUpperCase())
                formik.resetForm();
            }
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}<br/></small> :
            <small className="p-error"/>;
    };

    if (speechBasesLoading) {
        return <Loading/>
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex gap-5">
                <div className="">
                    <div className="flex-auto mb-4">
                        <label htmlFor="mode" className="font-bold block mb-2">Modalidad</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="mode"
                                name="mode"
                                value={formik.values.mode}
                                options={modeSpeech}
                                placeholder="Selecciona una modalidad"
                                className={classNames({'p-invalid': isFormFieldInvalid('mode')})}
                                onChange={(e) => {
                                    formik.setFieldValue('mode', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="studentsSpeech" className="font-bold block mb-2">Seleccionar alumnos</label>
                        <div className='p-inputgroup w-full'>
                            <MultiSelect
                                id="studentsSpeech"
                                name="studentsSpeech"
                                options={filterStudents}
                                value={formik.values.studentsSpeech}
                                emptyMessage='No existen alumnos matriculados para este curso'
                                onChange={(e) => {
                                    formik.setFieldValue('studentsSpeech', e.value);
                                }}
                                optionLabel='name'
                                placeholder="Seleccionar alumnos"
                                maxSelectedLabels={0}
                                selectedItemsLabel={'{0} Alumnos seleccionados'}
                                className={classNames({'p-invalid': isFormFieldInvalid('studentsSpeech')})}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="ambit" className="font-bold block mb-2">Niveles fonoaudiológicos</label>
                        <div className='p-inputgroup w-full'>
                            <Dropdown
                                inputId="ambit"
                                name="ambit"
                                value={formik.values.ambit}
                                options={ambit}
                                placeholder="Selecciona un nivel"
                                className={classNames({'p-invalid': isFormFieldInvalid('ambit')})}
                                onChange={(e) => {
                                    setSelectAmbit(e.value)
                                    formik.setFieldValue('ambit', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="content" className="font-bold block mb-2">Contenido</label>
                        <div className='p-inputgroup w-full'>
                            <MultiSelect
                                inputId="content"
                                name="content"
                                value={formik.values.content}
                                options={content}
                                emptyMessage={'Debes seleccionar un nivel primero'}
                                placeholder="Seleccionar contenido"
                                className={classNames({'p-invalid': isFormFieldInvalid('content')})}
                                selectedItemsLabel={'{0} Contenidos seleccionados'}
                                maxSelectedLabels={0}
                                onChange={(e) => {
                                    // setSelectAmbit(e.value)
                                    formik.setFieldValue('content', e.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-auto mb-4">
                        <label htmlFor="register" className="font-bold block mb-2">Registro / Observaciones</label>
                        <div className='p-inputgroup w-full'>
                            <InputTextarea
                                id="register"
                                name="register"
                                value={formik.values.register}
                                onChange={(e) => {
                                    formik.setFieldValue('register', e.target.value);
                                }}
                                placeholder="Ingresar registros u observaciones"
                                className={classNames({'p-invalid': isFormFieldInvalid('register')})}
                            />
                        </div>
                    </div>
                    {getFormErrorMessage('mode')}
                    {getFormErrorMessage('studentsSpeech')}
                    {getFormErrorMessage('ambit')}
                    {getFormErrorMessage('content')}
                    {getFormErrorMessage('register')}
                    <Button type='submit' label='Guardar registro fonoaudilógico' severity='success'
                            style={{width: '100%'}}/>
                </div>
                <div className="flex-auto">
                    <GetTel grade={grade}/>
                </div>
            </div>
        </form>

    )
};

export default LandingTEL;