import { useState } from 'react';
import Link from 'next/link';
import styles from './CourseDropdown.module.css';
import { courses } from '../../utils/course'

export default function CourseDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <>
      <a 
        id="courses-link" 
        className={styles.dropbtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        Courses <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </a>
      <div className={`${styles.dropdownContent} ${isOpen ? styles.open : ''}`}>
        {courses.map(course => (
          <Link 
            key={course.id}
            href={`/courses/${course.id}`}
            className={styles.courseDropdownLink}
            data-course-id={course.id}
          >
            {course.name}
          </Link>
        ))}
      </div>
    </>
  );
}