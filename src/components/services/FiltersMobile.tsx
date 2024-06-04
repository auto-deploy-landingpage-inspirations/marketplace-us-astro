import type { Component } from "solid-js";
import { createEffect, createSignal, For, Show } from "solid-js";

import supabase from "../../lib/supabaseClient";
import { ui } from "../../i18n/ui";
import type { uiObject } from "../../i18n/uiType";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
const values = ui[lang] as uiObject;
const productCategoryData = values.subjectCategoryInfo;

let grades: Array<{ grade: string; id: number }> = [];
let subjects: Array<any> = [];

const { data: gradeData, error: gradeError } = await supabase
    .from("grade_level")
    .select("*");

if (gradeError) {
    console.log("supabase error: " + gradeError.message);
} else {
    gradeData.forEach((grade) => {
        grades.push({
            grade: grade.grade,
            id: grade.id,
        });
    });
    grades.sort((a, b) => (a.id > b.id ? 0 : -1));
}

const { data, error } = await supabase.from("post_subject").select("*");

if (error) {
    console.log("supabase error: " + error.message);
} else {
    console.log(data);
    data.forEach((subject) => {
        subjects.push({ subject: subject.subject, id: subject.id });
    });
}

const subjectData = productCategoryData.subjects;

let allSubjectInfo: any[] = [];

for (let i = 0; i < subjectData.length; i++) {
    allSubjectInfo.push({
        ...subjectData[i],
        ...subjects.find(
            (itmInner) => itmInner.id.toString() === subjectData[i].id
        ),
    });
}

interface Props {
    filterPostsByGrade: (grade: string) => void;
    filterPostsBySubject: (currentSubject: string) => void;
}

export const FiltersMobile: Component<Props> = (props) => {
    const [showGrades, setShowGrades] = createSignal(false);
    const [showSubjects, setShowSubjects] = createSignal(false);
    const [showFilters, setShowFilters] = createSignal(false);
    const [grade, setGrade] =
        createSignal<Array<{ grade: string; id: number }>>(grades);
    const [gradeFilters, setGradeFilters] = createSignal<
        Array<{ grade: string; id: number }>
    >([]);
    const [subjects, setSubjects] = createSignal<Array<string>>([]);
    const [gradeFilterCount, setGradeFilterCount] = createSignal<number>(1);
    const [subjectFilterCount, setSubjectFilterCount] = createSignal<number>(1);
    const [showFilterNumber, setShowFilterNumber] = createSignal(false);

    createEffect(() => {
        if(gradeFilterCount() > 0 || subjectFilterCount() > 0) {
            setShowFilterNumber(true);
        }
    })

    const setGradesFilter = (item: { grade: string; id: number }) => {
        if (gradeFilters().includes(item)) {
            let currentGradeFilters = gradeFilters().filter(
                (el) => el !== item
            );
            setGradeFilters(currentGradeFilters);
        } else {
            setGradeFilters([...gradeFilters(), item]);
        }
        props.filterPostsByGrade(item.id.toString());
    };

    const clearMobileFilters = () => {
        console.log("in clearMobileFilters")
        console.log(gradeFilters())
        
        setGradeFilters([]);
        console.log(gradeFilters());
        setSubjects([]);
    }

    const clearSubjects = () => {
        let selectedSubjects = document.querySelectorAll(".selected");

        selectedSubjects.forEach((subject) => {
            subject.classList.remove("selected");
        });

        setSubjects([]);
        // filterPosts();
    };

    const clearGrades = () => {
        const gradeCheckboxes = document.querySelectorAll(
            "input[type='checkbox'].grade"
        ) as NodeListOf<HTMLInputElement>;

        gradeCheckboxes.forEach((checkbox) => {
            if (checkbox && checkbox.checked) checkbox.click();
        });

        setGradeFilters([]);
        // filterPosts();
    };

    return (
        <div class="sticky top-0 z-50 mx-4 h-full w-3/4 max-w-[300px] bg-background1 dark:bg-background1-DM">
            <button
                class="mt-2 w-full"
                onClick={() => {
                    if(showGrades() === true || showSubjects() === true) {
                        setShowGrades(false);
                        setShowSubjects(false);
                        setShowFilters(false);
                    } else if(showFilters() === true) {
                        setShowFilters(false);
                    } else {
                        setShowFilters(true);
                    }
                }}
            >
                <div class="h-full flex items-center relative">
                    <svg
                        fill="none"
                        width="20px"
                        height="20px"
                        viewBox="0 0 32 32"
                        class="fill-icon1 dark:fill-icon1-DM"
                    >
                        <path d="M31.078 1.366c-0.221-0.371-0.621-0.616-1.078-0.616-0 0-0 0-0 0h-28c-0.69 0-1.25 0.56-1.25 1.25 0 0.223 0.058 0.432 0.16 0.613l-0.003-0.006 9.843 17.717v5.676c0 0.486 0.278 0.908 0.684 1.114l0.007 0.003 8 4c0.163 0.084 0.355 0.133 0.559 0.133 0.243 0 0.47-0.070 0.661-0.191l-0.005 0.003c0.359-0.223 0.594-0.615 0.594-1.062 0-0 0-0.001 0-0.001v0-9.676l9.842-17.717c0.1-0.175 0.159-0.385 0.159-0.609 0-0.233-0.064-0.452-0.176-0.638l0.003 0.006zM18.908 19.393c-0.099 0.175-0.158 0.384-0.158 0.607v7.977l-5.5-2.75v-5.227c0-0 0-0.001 0-0.002 0-0.222-0.058-0.431-0.16-0.612l0.003 0.006-8.969-16.143h23.751z"></path>
                    </svg>
                    
                    <Show when={ showFilterNumber() === true}>
                        <div class="self-start -ml-1 flex justify-center items-center bg-btn1 dark:bg-btn1-DM rounded-full h-5 w-5">
                            <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">{ gradeFilterCount() + subjectFilterCount() }</p>
                        </div>
                    </Show>
                    
                    <h1 class="ml-2 text-xl py-2">{t("buttons.filters")}</h1>
                </div>
            </button>

            <div class="absolute h-full w-full">
                <Show when={showFilters() === true}>
                    <div class="main-pop-out relative h-96 w-full border border-border1 bg-background1 dark:border-border1-DM dark:bg-background1-DM rounded-b">
                        <button
                            class="w-full"
                            onClick={() => {
                                setShowFilters(false);

                                if (showSubjects() === true) {
                                    setShowSubjects(false);
                                }
                                setShowGrades(!showGrades());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.grades")}
                                </h2>

                                <Show when={ gradeFilterCount() > 0}>
                                    <div class="flex justify-center items-center bg-btn1 dark:bg-btn1-DM rounded-full h-5 w-5">
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">{ gradeFilterCount() }</p>
                                    </div>
                                </Show>

                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        <button
                            class="w-full"
                            onClick={() => {
                                setShowFilters(false);

                                if (showGrades() === true) {
                                    setShowGrades(false);
                                }
                                setShowSubjects(!showSubjects());
                            }}
                        >
                            <div class="flex items-center justify-between border-b border-border1 dark:border-border1-DM">
                                <h2 class="mx-2 my-4 flex flex-1 text-xl text-ptext1 dark:text-ptext1-DM">
                                    {t("formLabels.subjects")}
                                </h2>

                                <Show when={ subjectFilterCount() > 0}>
                                    <div class="flex justify-center items-center bg-btn1 dark:bg-btn1-DM rounded-full h-5 w-5">
                                        <p class="text-[10px] text-ptext2 dark:text-ptext2-DM">{ subjectFilterCount() }</p>
                                    </div>
                                </Show>

                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowRightIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="mr-2 stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M15 18l6-6-6-6" />
                                    <path
                                        stroke-linecap="round"
                                        d="M21 12h-1"
                                    />
                                </svg>
                            </div>
                        </button>

                        <div class="absolute bottom-0 my-4 mt-4 flex w-full justify-around">
                            <button 
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={ clearMobileFilters }
                            >
                                {t("clearFilters.filterButtons.0.text")}
                            </button>
                            <button 
                                class="w-32 rounded border border-border1 bg-btn1 py-1 font-light text-ptext2 dark:border-border1-DM dark:bg-btn2-DM dark:text-ptext2-DM"
                                onClick = { () => {
                                    setShowFilters(false);
                                }}
                            >
                                {t("clearFilters.filterButtons.5.text")}
                            </button>
                        </div>
                    </div>
                </Show>

                <Show when={showGrades() === true}>
                    <div class="bg-background1 dark:bg-background1-DM border border-border1 dark:border-border1-DM rounded-b">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowGrades(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pb-1 pl-2 dark:border-border1-DM">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>

                                <h2 class="flex flex-1 text-xl font-bold text-ptext1 dark:text-ptext1-DM py-2">
                                    {t("formLabels.grades")}
                                </h2>
                            </div>
                        </button>

                        <div class="ml-8 flex flex-wrap">
                            <For each={grade()}>
                                {(item) => (
                                    <div class="flex w-1/2 flex-row flex-wrap py-1">
                                        <div class="flex items-center">
                                            <input
                                                aria-label={
                                                    t(
                                                        "ariaLabels.checkboxGrade"
                                                    ) + item.grade
                                                }
                                                type="checkbox"
                                                class="grade mr-4 scale-125 leading-tight grade"
                                                onClick={() => {
                                                    setGradesFilter(item);
                                                    setGradeFilterCount(gradeFilterCount() + 1);
                                                }}
                                            />
                                        </div>
                                        <div class="flex items-center">
                                            <span class="text-lg text-ptext1 dark:text-ptext1-DM">
                                                {item.grade}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>

                        <div class="my-2">
                            <button 
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={ clearMobileFilters }
                            >
                                {t("clearFilters.filterButtons.2.text")}
                            </button>
                        </div>
                    </div>
                </Show>

                <Show when={showSubjects() === true}>
                    <div class="bg-background1 dark:bg-background1-DM border border-border1 dark:border-border1-DM rounded-b">
                        <button
                            class="w-full"
                            onClick={() => {
                                if (showFilters() === false) {
                                    setShowSubjects(false);
                                    setShowFilters(true);
                                }
                            }}
                        >
                            <div class="flex items-center border-b border-border1 pl-2 dark:border-border1-DM pb-1">
                                <svg
                                    width="30px"
                                    height="30px"
                                    viewBox="0 0 24 24"
                                    role="img"
                                    aria-labelledby="arrowLeftIconTitle"
                                    stroke="none"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    fill="none"
                                    color="#000000"
                                    class="stroke-icon1 dark:stroke-icon1-DM"
                                >
                                    <path d="M9 6l-6 6 6 6" />
                                    <path stroke-linecap="round" d="M3 12h1" />
                                </svg>
                                <h2 class="flex flex-1 text-xl font-bold text-ptext1 dark:text-ptext1-DM py-2">
                                    {t("formLabels.subjects")}
                                </h2>
                            </div>
                        </button>

                        <div class="mb-2 pb-8">
                            {allSubjectInfo?.map((item) => (
                                <div class="flex flex-row pl-2">
                                    <div class="flex items-center">
                                        <input
                                            type="checkbox"
                                            class="subject mr-2 scale-125 leading-tight"
                                            onClick={() => {
                                                console.log(
                                                    "Subject selected: " +
                                                        item.name
                                                );
                                                setSubjectFilterCount(subjectFilterCount() + 1);
                                                props.filterPostsBySubject(
                                                    item.id.toString()
                                                );
                                            }}
                                        />
                                    </div>

                                    <div class="flex w-full items-center text-start">
                                        <span class="w-full text-ptext1 dark:text-ptext1-DM">
                                            <p class="ml-4 border-b border-border1 py-2 text-lg text-ptext1 dark:border-border1-DM dark:text-ptext1-DM ">
                                                {item.name}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div class="my-2">
                            <button 
                                class="w-32 rounded border border-border1 py-1 font-light dark:border-border1-DM"
                                onClick={ clearMobileFilters }
                            >
                                {t("clearFilters.filterButtons.1.text")}
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
};
