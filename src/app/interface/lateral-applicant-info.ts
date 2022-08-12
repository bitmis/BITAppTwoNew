export interface LateralApplicantInfo {

    application_no: string
    year: string
    full_name: string
    full_name_sinhala: string
    full_name_tamil: string
    name_marking: string
    initials: string
    title: string
    gender: string
    id_type: string
    id_no: string
    dob: string
    citizenship: string
    nationality: string

    email: string
    phone: string
    mobile: string
    address1: string
    address2: string
    address3: string
    district: string
    country: string


    qualification_type: string
    qualification_pending: string //0
    need_different_req: string //0
    al_year: string
    al_index_no: string
    al_type: string
    al_subject1: string
    al_result1: string
    al_subject2: string
    al_result2: string
    al_subject3: string
    al_result3: string
    al_subject4: string
    al_result4: string

    ol_year1: string
    ol_subject1: string // MATHEMATICS
    ol_result1: string
    ol_index1:string

    ol_year2: string
    ol_subject2: string //ENGLISH
    ol_result2: string
    ol_index2:string

    type: string
    payment_category: string
    payment_type: string
    amount: string
    over_payment: string
    surcharge: string
    bank: string
    bank_branch: string
    paid_date: string
    invoice_no: string

    fit_registration_no: string
    bit_registration_no: string
    disabilities: string

    application_status: string
    apply_bit_year: string



}
