import { getDataLoop } from "./core";

interface Projects {
    [key: string]: number;
}


export const projects: Projects = {
    // Exam
    // "exam-rank-02": 1320,
    // "exam-rank-03": 1321,
    // "exam-rank-04": 1322,
    // "exam-rank-05": 1323,
    "exam-rank-06": 1324,

    // Circle 0
    // "libft": 1314,

    // Circle 1
    "get_next_line": 1327,
    "ft_printf": 1316,
    "Born2beroot": 1994,

    // Circle 2
    "push_swap": 1447,
    "pipex": 2004,
    "minitalk": 2005,
    "so_long": 2009,
    "FdF": 2008,
    "fract-ol": 1476,
    
    // Circle 3
    "minishell": 1331,
    "philosophers": 1334,

    // Circle 4
    "cub3d": 1337,
    "miniRT": 1315,
    "NetPractice": 2007,
    "CPP-Module-00": 1338,
    "CPP-Module-01": 1339,
    "CPP-Module-02": 1340,
    "CPP-Module-03": 1341,
    "CPP-Module-04": 1342,
    "CPP-Module-05": 1343,
    "CPP-Module-06": 1344,
    "CPP-Module-07": 1345,
    "CPP-Module-08": 1346,

    // Circle 5
    "webserv": 1332,
    "ft_irc": 1336,
    "ft_containers": 1335,
    "inception": 1983,

    // Circle 6
    "ft_transcendence": 1337,

    // Outer Circle
    // 118개
};

export const getProjectsUsers = async () => {
    for (const project in projects) {
        await getDataLoop(`projects/${projects[project]}/projects_users`, project);
    }
}