import React, {useReducer} from 'react';
import StudentsReducer from "@/context/students/Students.reducer";
import {
    getEvaluationsByOaByQuery,
    getObservationByIdQuery,
    getSchoolRegistersByIdQuery,
    getStudentsBySchoolQuery, setEvaluationsByOaQuery, setObservationQuery, setSchoolRegisterQuery,
    setStudentQuery
} from "@/queries/students";
import {
    CLEAN_STUDENT,
    GET_ATTENDANCE,
    GET_ATTENDANCE_ERROR,
    GET_ATTENDANCE_LOADING,
    GET_ATTENDANCES,
    GET_ATTENDANCES_ERROR,
    GET_ATTENDANCES_LOADING, GET_EVALUATIONS_BY_OA, GET_EVALUATIONS_BY_OA_ERROR, GET_EVALUATIONS_BY_OA_LOADING,
    GET_OBSERVATIONS,
    GET_OBSERVATIONS_ERROR,
    GET_OBSERVATIONS_LOADING,
    GET_SCHOOL_REGISTERS,
    GET_SCHOOL_REGISTERS_ERROR,
    GET_SCHOOL_REGISTERS_LOADING,
    GET_STUDENTS,
    GET_STUDENTS_ERROR,
    GET_STUDENTS_LOADING,
    SET_ATTENDANCE,
    SET_ATTENDANCE_ERROR,
    SET_ATTENDANCE_LOADING, SET_EVALUATIONS_BY_OA, SET_EVALUATIONS_BY_OA_ERROR, SET_EVALUATIONS_BY_OA_LOADING,
    SET_OBSERVATIONS,
    SET_OBSERVATIONS_ERROR,
    SET_OBSERVATIONS_LOADING, SET_SCHOOL_REGISTERS, SET_SCHOOL_REGISTERS_ERROR,
    SET_SCHOOL_REGISTERS_LOADING,
    SET_STUDENT,
    SET_STUDENT_ERROR,
    SET_STUDENT_LOADING
} from "@/context/students/Students.types";
import StudentContext from "./Students.context";
import {studentDecorator, studentsDecorator} from "@/context/students/Students.decorator";
import {getAttendanceByDateQuery, getAttendanceByMonthQuery, setAttendanceQuery} from "@/queries/assistance";

export const initialStateStudent = {
    students: [],
    studentsError: false,
    studentsLoading: true,
    attendances: [],
    attendancesError: false,
    attendancesLoading: false,
    getAttendances: [],
    getAttendancesError: false,
    getAttendancesLoading: true,
    attendance: [],
    attendanceError: false,
    attendanceLoading: true,
    observations: [],
    observationsError: false,
    observationsLoading: true,
    schoolRegisters: [],
    schoolRegistersError: false,
    schoolRegistersLoading: true,
    evaluationByOa: [],
    evaluationByOaError: false,
    evaluationByOaLoading: true
};

const StudentsState = (props) => {
    const [state, dispatch] = useReducer(StudentsReducer, initialStateStudent)

    const clearStudent = () => {
        dispatch({
            type: CLEAN_STUDENT
        });
    }

    const getAttendanceByDate = async (date, grade) => {
        dispatch({
            type: GET_ATTENDANCE_LOADING
        });
        try {
            const newAttendance = await getAttendanceByDateQuery(date, grade)
            dispatch({
                type: GET_ATTENDANCE,
                payload: newAttendance
            });
        } catch (e) {
            dispatch({
                type: GET_ATTENDANCE_ERROR
            });
        }
    }

    const getAttendanceByMonth = async (grade, month, year) => {
        dispatch({
            type: GET_ATTENDANCES_LOADING
        });
        try {
            const newAttendance = await getAttendanceByMonthQuery(grade, month, year)
            dispatch({
                type: GET_ATTENDANCES,
                payload: newAttendance
            });
        } catch (e) {
            dispatch({
                type: GET_ATTENDANCES_ERROR
            });
        }
    }

    const setAttendance = async (attendance) => {
        dispatch({
            type: SET_ATTENDANCE_LOADING
        });
        try {
            const newAttendance = await setAttendanceQuery(attendance)
            dispatch({
                type: SET_ATTENDANCE,
                payload: newAttendance
            });
        } catch (e) {
            dispatch({
                type: SET_ATTENDANCE_ERROR
            });
        }
    }

    const getStudentsBySchool = async (school) => {
        dispatch({
            type: GET_STUDENTS_LOADING
        });
        try {
            const response = await getStudentsBySchoolQuery(school)
            dispatch({
                type: GET_STUDENTS,
                payload: studentsDecorator(response)
            });
        } catch (e) {
            dispatch({
                type: GET_STUDENTS_ERROR
            });
        }
    }

    const setStudent = async (student) => {
        dispatch({
            type: SET_STUDENT_LOADING
        });
        try {
            const newStudent = await setStudentQuery(student)
            dispatch({
                type: SET_STUDENT,
                payload: studentDecorator(newStudent)
            });
        } catch (e) {
            console.log(e)
            dispatch({
                type: SET_STUDENT_ERROR
            });
        }
    }

    const getObservationById = async (id) => {
        dispatch({
            type: GET_OBSERVATIONS_LOADING
        });
        try {
            const response = await getObservationByIdQuery(id)
            dispatch({
                type: GET_OBSERVATIONS,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_OBSERVATIONS_ERROR
            });
        }
    }

    const setObservationSchool = async (doc) => {
        dispatch({
            type: SET_OBSERVATIONS_LOADING
        });
        try {
            await setObservationQuery(doc)
            dispatch({
                type: SET_OBSERVATIONS,
            });
        } catch (e) {
            console.log(e)
            dispatch({
                type: SET_OBSERVATIONS_ERROR
            });
        }
    }

    const getRegistersById = async (id) => {
        dispatch({
            type: GET_SCHOOL_REGISTERS_LOADING
        });
        try {
            const response = await getSchoolRegistersByIdQuery(id)
            dispatch({
                type: GET_SCHOOL_REGISTERS,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_SCHOOL_REGISTERS_ERROR
            });
        }
    }

    const setSchoolRegister = async (doc) => {
        dispatch({
            type: SET_SCHOOL_REGISTERS_LOADING
        });
        try {
            await setSchoolRegisterQuery(doc)
            dispatch({
                type: SET_SCHOOL_REGISTERS,
            });
        } catch (e) {
            console.log(e)
            dispatch({
                type: SET_SCHOOL_REGISTERS_ERROR
            });
        }
    }

    const setEvaluationsByOa = async (doc) => {
        dispatch({
            type: SET_EVALUATIONS_BY_OA_LOADING
        });
        try {
            await setEvaluationsByOaQuery(doc)
            dispatch({
                type: SET_EVALUATIONS_BY_OA,
            });
        } catch (e) {
            console.log(e)
            dispatch({
                type: SET_EVALUATIONS_BY_OA_ERROR
            });
        }
    }

    const getEvaluationsByGrade = async (grade) => {
        dispatch({
            type: GET_EVALUATIONS_BY_OA_LOADING
        });
        try {
            const response = await getEvaluationsByOaByQuery(grade)
            dispatch({
                type: GET_EVALUATIONS_BY_OA,
                payload: response
            });
        } catch (e) {
            dispatch({
                type: GET_EVALUATIONS_BY_OA_ERROR
            });
        }
    }

    return <StudentContext.Provider
        value={{
            students: state.students,
            studentsError: state.studentsError,
            studentsLoading: state.studentsLoading,
            attendances: state.attendances,
            attendancesError: state.attendancesError,
            attendancesLoading: state.attendancesLoading,
            attendance: state.attendance,
            attendanceError: state.attendanceError,
            attendanceLoading: state.attendanceLoading,
            observations: state.observations,
            observationsError: state.observationsError,
            observationsLoading: state.observationsLoading,
            schoolRegisters: state.schoolRegisters,
            schoolRegistersError: state.schoolRegistersError,
            schoolRegistersLoading: state.schoolRegistersLoading,
            evaluationByOa: state.evaluationByOa,
            evaluationByOaError: state.evaluationByOaError,
            evaluationByOaLoading: state.evaluationByOaLoading,
            getStudentsBySchool,
            setStudent,
            clearStudent,
            setAttendance,
            getAttendanceByDate,
            getAttendanceByMonth,
            getObservationById,
            getRegistersById,
            setObservationSchool,
            setSchoolRegister,
            setEvaluationsByOa,
            getEvaluationsByGrade
        }}
    >
        {props.children}
    </StudentContext.Provider>
}

export default StudentsState;